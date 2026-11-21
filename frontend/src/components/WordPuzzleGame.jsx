import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function WordPuzzleGame({ onBalanceChange }) {
  const [scrambled, setScrambled] = useState('');
  const [answerLength, setAnswerLength] = useState(0);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [totalPoints, setTotalPoints] = useState(null);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadPuzzle() {
      try {
        const [puzzleResponse, rewardsResponse] = await Promise.all([
          api.wordPuzzle(),
          api.rewards(),
        ]);

        if (!active) return;

        setScrambled(puzzleResponse.data.scrambled);
        setAnswerLength(puzzleResponse.data.answerLength);
        setHasAttempted(puzzleResponse.data.hasAttempted);
        setIsCorrect(puzzleResponse.data.isCorrect);
        setCorrectAnswer(puzzleResponse.data.correctAnswer || '');
        setTotalPoints(rewardsResponse.data.totalPoints);

        if (typeof onBalanceChange === 'function') {
          onBalanceChange(rewardsResponse.data);
        }
      } catch (error) {
        if (active) {
          setResult(error.message || 'Unable to load the word puzzle');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPuzzle();

    return () => {
      active = false;
    };
  }, []);

  async function submitAnswer(event) {
    event.preventDefault();

    if (!answer.trim() || submitting || hasAttempted) return;

    setSubmitting(true);
    setResult('');

    try {
      const response = await api.attemptWordPuzzle(answer);

      setHasAttempted(true);
      setIsCorrect(response.data.isCorrect);
      setCorrectAnswer(response.data.correctAnswer || '');

      if (response.data.totalPoints !== undefined) {
        setTotalPoints(response.data.totalPoints);

        if (typeof onBalanceChange === 'function') {
          try {
            const rewardsResponse = await api.rewards();
            onBalanceChange(rewardsResponse.data);
          } catch {
            onBalanceChange({
              totalPoints: response.data.totalPoints,
            });
          }
        }
      }

      setResult(response.message);
    } catch (error) {
      setResult(error.message || 'Unable to submit the answer');

      if (error.message?.includes('already been attempted')) {
        setHasAttempted(true);

        try {
          const [puzzleResponse, rewardsResponse] = await Promise.all([
            api.wordPuzzle(),
            api.rewards(),
          ]);

          setIsCorrect(puzzleResponse.data.isCorrect);
          setCorrectAnswer(puzzleResponse.data.correctAnswer || '');
          setTotalPoints(rewardsResponse.data.totalPoints);

          if (typeof onBalanceChange === 'function') {
            onBalanceChange(rewardsResponse.data);
          }
        } catch {
          // Keep the existing duplicate-attempt response visible.
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="summary-card">
        <h2>Word Puzzle</h2>
        <p className="muted">Loading today&apos;s puzzle…</p>
      </section>
    );
  }

  return (
    <section className="summary-card">
      <h2>Word Puzzle</h2>
      <p>Unscramble this shopping-related word.</p>

      {scrambled && (
        <div
          style={{
            margin: '18px 0',
            textAlign: 'center',
            fontSize: 'clamp(1.5rem, 8vw, 2.5rem)',
            fontWeight: 700,
            letterSpacing: '0.18em',
          }}
          aria-label="Scrambled word"
        >
          {scrambled}
        </div>
      )}

      {totalPoints !== null && (
        <p className="muted">
          Current reward balance: <strong>{totalPoints} points</strong>
        </p>
      )}

      {hasAttempted ? (
        <div>
          {isCorrect === false && (
            <p className="form-error">
              Incorrect. The correct answer is{' '}
              {correctAnswer || 'shown in the attempt result'}.
            </p>
          )}

          {isCorrect === true && (
            <p className="form-message">
              🎉 Correct! You won 25 reward points
            </p>
          )}

          {isCorrect === null && (
            <p className="muted">
              Today&apos;s puzzle has already been attempted.
            </p>
          )}
        </div>
      ) : (
        <form
          className="checkout-form"
          onSubmit={submitAnswer}
          style={{ marginTop: '16px' }}
        >
          <label className="form-field form-field-wide">
            Your answer
            <input
              value={answer}
              onChange={(event) =>
                setAnswer(event.target.value.toUpperCase())
              }
              maxLength={30}
              placeholder={
                answerLength ? `${answerLength} letters` : 'Enter the word'
              }
              autoComplete="off"
              required
            />
          </label>

          <button
            className="button"
            type="submit"
            disabled={submitting || !answer.trim()}
          >
            {submitting ? 'Checking…' : 'Submit answer'}
          </button>
        </form>
      )}

      {result && (
        <p className={isCorrect ? 'form-message' : 'form-error'}>
          {result}
        </p>
      )}
    </section>
  );
}
