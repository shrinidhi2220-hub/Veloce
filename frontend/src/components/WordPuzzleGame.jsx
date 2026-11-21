import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api.js';

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
          apiClient('/rewards/game/word-puzzle', { method: 'GET' }),
          apiClient('/rewards/me', { method: 'GET' }),
        ]);

        if (!active) return;
        if (!puzzleResponse?.success || !puzzleResponse?.data) {
          throw new Error(puzzleResponse?.message || 'Unable to load today\'s word puzzle.');
        }

        const puzzle = puzzleResponse.data;
        setScrambled(puzzle.scrambled || '');
        setAnswerLength(Number(puzzle.answerLength || 0));
        setHasAttempted(Boolean(puzzle.hasAttempted));
        setIsCorrect(typeof puzzle.isCorrect === 'boolean' ? puzzle.isCorrect : null);
        setCorrectAnswer(puzzle.correctAnswer || '');
        setTotalPoints(Number(rewardsResponse?.data?.totalPoints || 0));
      } catch (error) {
        if (active) setResult(error.message || 'Unable to load the word puzzle.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPuzzle();
    return () => { active = false; };
  }, []);

  async function submitAnswer(event) {
    event.preventDefault();
    if (!answer.trim() || submitting || hasAttempted) return;

    setSubmitting(true);
    setResult('');

    try {
      const response = await apiClient('/rewards/game/word-puzzle/attempt', {
        method: 'POST',
        body: JSON.stringify({ answer: answer.trim().toUpperCase() }),
      });

      if (!response?.success || !response?.data) {
        throw new Error(response?.message || 'The answer could not be submitted.');
      }

      const data = response.data;
      setHasAttempted(true);
      setIsCorrect(Boolean(data.isCorrect));
      setCorrectAnswer(data.correctAnswer || '');
      setTotalPoints(Number(data.totalPoints ?? totalPoints ?? 0));
      setResult(response.message || (data.isCorrect
        ? 'Correct! You won 25 reward points.'
        : `Incorrect. The correct answer is ${data.correctAnswer || 'not available'}.`));

      if (typeof onBalanceChange === 'function') {
        try {
          await onBalanceChange();
        } catch (refreshError) {
          console.warn('Reward balance refresh failed:', refreshError.message);
        }
      }
    } catch (error) {
      const message = error.message || 'Unable to submit the answer.';
      setResult(message);

      if (/already been attempted/i.test(message)) {
        setHasAttempted(true);
        try {
          const [puzzleResponse, rewardsResponse] = await Promise.all([
            apiClient('/rewards/game/word-puzzle', { method: 'GET' }),
            apiClient('/rewards/me', { method: 'GET' }),
          ]);
          const puzzle = puzzleResponse?.data || {};
          setIsCorrect(typeof puzzle.isCorrect === 'boolean' ? puzzle.isCorrect : null);
          setCorrectAnswer(puzzle.correctAnswer || '');
          setTotalPoints(Number(rewardsResponse?.data?.totalPoints || 0));
          if (typeof onBalanceChange === 'function') await onBalanceChange();
        } catch (refreshError) {
          console.warn('Could not reload the completed word puzzle:', refreshError.message);
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="summary-card" aria-live="polite">
        <h2>Word Puzzle</h2>
        <p className="muted">Loading today's puzzle...</p>
      </section>
    );
  }

  return (
    <section className="summary-card" aria-labelledby="velo-word-puzzle-title">
      <h2 id="velo-word-puzzle-title">Word Puzzle</h2>
      <p>Unscramble this shopping-related word. You get one attempt each day.</p>

      {scrambled && (
        <div
          style={{
            margin: '18px 0',
            textAlign: 'center',
            fontSize: 'clamp(1.5rem, 8vw, 2.5rem)',
            fontWeight: 700,
            letterSpacing: '0.18em',
            overflowWrap: 'anywhere',
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
        <div aria-live="polite">
          {isCorrect === false && (
            <p className="form-error">
              Incorrect. The correct answer is <strong>{correctAnswer || 'not available'}</strong>.
            </p>
          )}
          {isCorrect === true && (
            <p className="form-message">Correct! You won 25 reward points.</p>
          )}
          {isCorrect === null && (
            <p className="muted">Today's puzzle has already been attempted.</p>
          )}
        </div>
      ) : (
        <form className="checkout-form" onSubmit={submitAnswer} style={{ marginTop: '16px' }}>
          <label className="form-field form-field-wide">
            Your answer
            <input
              value={answer}
              onChange={(event) => setAnswer(event.target.value.toUpperCase())}
              maxLength={30}
              placeholder={answerLength ? `${answerLength} letters` : 'Enter the word'}
              autoComplete="off"
              disabled={submitting}
              required
            />
          </label>
          <button className="button" type="submit" disabled={submitting || !answer.trim()}>
            {submitting ? 'Checking...' : 'Submit answer'}
          </button>
        </form>
      )}

      {result && !hasAttempted && (
        <p className="form-error" role="alert" style={{ marginTop: '12px' }}>
          {result}
        </p>
      )}
    </section>
  );
}