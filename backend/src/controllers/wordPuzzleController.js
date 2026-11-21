const { prisma } = require('../config/database');

const WORDS = [
  'PRODUCT',
  'REVIEW',
  'REWARD',
  'MARKET',
  'ORDER',
  'CART',
  'CUSTOMER',
  'SELLER',
  'RESALE',
  'DISCOUNT',
];

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function hashString(value) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function scrambleWord(word, seed) {
  const characters = word.split('');

  for (let index = characters.length - 1; index > 0; index -= 1) {
    seed = (seed * 9301 + 49297) % 233280;
    const swapIndex = seed % (index + 1);
    [characters[index], characters[swapIndex]] =
      [characters[swapIndex], characters[index]];
  }

  let scrambled = characters.join('');

  if (scrambled === word) {
    scrambled = `${word.slice(1)}${word[0]}`;
  }

  return scrambled;
}

function getPuzzle() {
  const today = getToday();
  const answer = WORDS[hashString(today) % WORDS.length];

  return {
    today,
    answer,
    scrambled: scrambleWord(answer, hashString(`${today}-${answer}`)),
  };
}

function getLedgerWhere(userId, today) {
  return {
    userId_action_reference: {
      userId,
      action: 'DAILY_WORD_PUZZLE',
      reference: `WORD-Puzzle-${today}`,
    },
  };
}

async function getWordPuzzle(req, res, next) {
  try {
    const puzzle = getPuzzle();
    const existingAttempt = await prisma.rewardLedger.findUnique({
      where: getLedgerWhere(req.user.id, puzzle.today),
    });

    return res.json({
      success: true,
      data: {
        scrambled: puzzle.scrambled,
        answerLength: puzzle.answer.length,
        hasAttempted: Boolean(existingAttempt),
        isCorrect: existingAttempt
          ? existingAttempt.points > 0
          : null,
        correctAnswer: existingAttempt && existingAttempt.points === 0
          ? puzzle.answer
          : null,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function attemptWordPuzzle(req, res, next) {
  try {
    const puzzle = getPuzzle();
    const answer =
      typeof req.body?.answer === 'string'
        ? req.body.answer.trim().toUpperCase()
        : '';

    if (!answer) {
      return res.status(400).json({
        success: false,
        message: 'Enter your answer',
      });
    }

    if (answer.length > 30) {
      return res.status(400).json({
        success: false,
        message: 'Answer is too long',
      });
    }

    const ledgerWhere = getLedgerWhere(req.user.id, puzzle.today);
    const existingAttempt = await prisma.rewardLedger.findUnique({
      where: ledgerWhere,
    });

    if (existingAttempt) {
      return res.status(409).json({
        success: false,
        message: 'Today’s word puzzle has already been attempted',
        data: {
          isCorrect: existingAttempt.points > 0,
          correctAnswer: existingAttempt.points === 0
            ? puzzle.answer
            : null,
          pointsAwarded: 0,
          hasAttempted: true,
        },
      });
    }

    const isCorrect = answer === puzzle.answer;
    const pointsAwarded = isCorrect ? 25 : 0;

    try {
      await prisma.rewardLedger.create({
        data: {
          userId: req.user.id,
          points: pointsAwarded,
          action: 'DAILY_WORD_PUZZLE',
          reference: `WORD-Puzzle-${puzzle.today}`,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          message: 'Today’s word puzzle has already been attempted',
          data: {
            isCorrect: null,
            correctAnswer: puzzle.answer,
            pointsAwarded: 0,
            hasAttempted: true,
          },
        });
      }

      throw error;
    }

    const aggregate = await prisma.rewardLedger.aggregate({
      where: { userId: req.user.id },
      _sum: { points: true },
    });

    return res.status(201).json({
      success: true,
      message: isCorrect
        ? 'Correct! You won 25 reward points'
        : `Incorrect. The correct answer is ${puzzle.answer}`,
      data: {
        isCorrect,
        correctAnswer: puzzle.answer,
        pointsAwarded,
        totalPoints: aggregate._sum.points || 0,
        hasAttempted: true,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getWordPuzzle,
  attemptWordPuzzle,
};
