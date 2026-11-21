import React, { useState } from 'react';
import WordPuzzleGame from '../../components/WordPuzzleGame.jsx';
import {
  INITIAL_USER_REWARDS,
  REWARD_VOUCHERS,
  ENGAGEMENT_GAMES,
  SAMPLE_QUIZ_QUESTIONS
} from '../../mock/rewards.js';
import { useUI } from '../../context/UIContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../../components/common/Button/Button.jsx';
import { Badge } from '../../components/common/Badge/Badge.jsx';
import { Modal } from '../../components/common/Modal/Modal.jsx';
import {
  Trophy,
  Sparkles,
  Gift,
  Ticket,
  Trees,
  CheckCircle2,
  RotateCw,
  HelpCircle,
  Heart
} from 'lucide-react';
import './PlayEarn.css';

export function PlayEarn() {
  const { showToast } = useUI();
  const { applyPromo } = useCart();
  const { user, playDailyGame, refreshRewards } = useAuth();

  const pointsBalance = user?.seedsBalance ?? INITIAL_USER_REWARDS.pointsBalance;
  const [dailyStreak, setDailyStreak] = useState(INITIAL_USER_REWARDS.dailyStreakDays);

  // Modals for games
  const [activeGameModal, setActiveGameModal] = useState(null); // 'spin' | 'quiz' | 'pledge'
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // Spin Wheel Action
  const handleSpinWheel = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);
    try {
      const response = await playDailyGame();
      const awarded = Number(response.data?.pointsAwarded || 0);
      setSpinResult(awarded);
      showToast(response.message || (awarded > 0 ? `You earned ${awarded} reward points!` : 'Come back tomorrow and try again.'));
    } catch (error) {
      showToast(error.message || 'Daily game could not be recorded.', 'error');
    } finally {
      setIsSpinning(false);
    }
  };

  // Quiz Option Click
  const handleSelectQuizOption = (index) => {
    setSelectedOption(index);
    const currentQ = SAMPLE_QUIZ_QUESTIONS[quizIndex];
    const isCorrect = index === currentQ.correctIndex;

    setTimeout(() => {
      if (isCorrect) setQuizScore((prev) => prev + 1);

      if (quizIndex + 1 < SAMPLE_QUIZ_QUESTIONS.length) {
        setQuizIndex((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        setQuizFinished(true);
        showToast(`Quiz complete! Your score: ${quizScore + (isCorrect ? 1 : 0)}. This practice quiz does not credit reward points yet.`);
      }
    }, 600);
  };

  const handleResetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
    setSelectedOption(null);
  };

  // Circular Pledge Action
  const handleTakePledge = () => {
    showToast('Pledge preview completed. Verified pledge rewards are not enabled in this MVP yet.');
    setActiveGameModal(null);
  };

  // Voucher Redemption Action
  const handleRedeemVoucher = (voucher) => {
    showToast(`Voucher redemption for "${voucher.title}" is not enabled in this MVP yet.`, 'info');
  };

  return (
    <div className="play-earn-page">
      {/* Hero Header */}
      <section className="play-hero">
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-eucalyptus)', textTransform: 'uppercase', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '1rem' }}>
            <Trophy size={16} /> Gamified Rewards & Conscious Engagement
          </div>
          <h1>VELOCE Play & Earn</h1>
          <p style={{ maxWidth: '640px', margin: '0 auto', color: 'rgba(245,240,230,0.8)', fontSize: 'var(--text-md)', lineHeight: 1.7 }}>
            Earn reward points from the server-verified daily game and explore upcoming engagement challenges.
            Redeem your seeds for store discounts, curated gifts, or verified native tree planting.
          </p>
        </div>
      </section>

      {/* Floating Demo Seeds Wallet */}
      <div className="container">
        <div className="play-wallet-bar">
          <div className="wallet-stat">
            <h4>Your Seeds Balance</h4>
            <p style={{ color: 'var(--color-terracotta)' }}>{pointsBalance.toLocaleString()} Seeds</p>
          </div>

          <div className="wallet-stat">
            <h4>Membership Tier</h4>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-charcoal)' }}>Sage Patron Tier</p>
          </div>

          <div className="wallet-stat">
            <h4>Daily Check-in Streak</h4>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-sage)' }}>🔥 {dailyStreak} Days Active</p>
          </div>

          <div>
            <Badge variant="sage">Live Reward Ledger</Badge>
          </div>
        </div>

        {/* Interactive Engagement Games */}
        <div className="section-header">
          <span className="tagline">Daily Rituals</span>
          <h2>Harvest More Seeds Today</h2>
          <p>Participate in quick interactive challenges to grow your conscious balance.</p>
        </div>

        <div className="game-cards-grid">
          {/* Game 1: Daily Wheel of Earth */}
          <div className="game-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>🎡</span>
              <Badge variant="terracotta">Ready to Spin</Badge>
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Daily Wheel of Earth</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
              Spin the tactile wheel once every 24 hours to claim up to +300 bonus seeds or free shipping coupons.
            </p>
            <Button
              variant="charcoal"
              icon={RotateCw}
              onClick={() => {
                setActiveGameModal('spin');
                setSpinResult(null);
              }}
            >
              Spin the Wheel Now
            </Button>
          </div>

          {/* Game 2: Eco & Craft Quiz */}
          <div className="game-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>🌿</span>
              <Badge variant="sage">+200 Seeds Award</Badge>
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Weekly Eco & Craft Quiz</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
              Answer 3 fast trivia questions about organic textiles, raw pottery, and closed-loop living.
            </p>
            <Button
              variant="charcoal"
              icon={HelpCircle}
              onClick={() => {
                handleResetQuiz();
                setActiveGameModal('quiz');
              }}
            >
              Start 60-Second Quiz
            </Button>
          </div>

          {/* Game 3: Circular Drop-Off Pledge */}
          <div className="game-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>🌱</span>
              <Badge variant="eucalyptus">+300 Seeds Award</Badge>
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Circular Drop-Off Pledge</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
              Pledge to return a pre-loved craft item for studio restoration instead of sending it to landfill.
            </p>
            <Button
              variant="charcoal"
              icon={Heart}
              onClick={() => setActiveGameModal('pledge')}
            >
              Take the Pledge
            </Button>
          </div>
        </div>

        {/* Daily Word Puzzle - Member 4 feature, verified by the backend */}
        <div className="section-header">
          <span className="tagline">Daily Challenge</span>
          <h2>Shopping Word Puzzle</h2>
          <p>Unscramble a shopping-related word. A correct answer earns 25 reward points, recorded by the VELOCE reward ledger.</p>
        </div>
        <div style={{ maxWidth: '760px', margin: '0 auto 3rem' }}>
          <WordPuzzleGame onBalanceChange={refreshRewards} />
        </div>

        {/* Redeemable Rewards Catalogue */}
        <div className="section-header">
          <span className="tagline">Seed Exchange</span>
          <h2>Redeem Your Harvested Seeds</h2>
          <p>Exchange your earned points for discounts, bespoke merchandise, or ecological reforestation.</p>
        </div>

        <div className="reward-vouchers-grid">
          {REWARD_VOUCHERS.map((voucher) => {
            const canAfford = pointsBalance >= voucher.pointsCost;
            return (
              <div key={voucher.id} className="voucher-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-terracotta)', fontWeight: 700 }}>
                    {voucher.category}
                  </span>
                  <Badge variant={canAfford ? 'sage' : 'outline'}>
                    {voucher.pointsCost} Seeds
                  </Badge>
                </div>

                <h4 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>{voucher.title}</h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                  {voucher.description}
                </p>

                <div style={{ backgroundColor: 'var(--color-ivory)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', fontSize: '11px', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '1rem' }}>
                  Code: <code>{voucher.code}</code>
                </div>

                <Button
                  variant={canAfford ? 'terracotta' : 'outline'}
                  size="sm"
                  disabled={!canAfford}
                  onClick={() => handleRedeemVoucher(voucher)}
                >
                  {canAfford ? 'Redeem Voucher' : `Need ${voucher.pointsCost - pointsBalance} more`}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 1. Modal: Spin Wheel */}
      <Modal
        isOpen={activeGameModal === 'spin'}
        onClose={() => setActiveGameModal(null)}
        title="Daily Wheel of Earth"
        maxWidth="460px"
      >
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-ivory)',
              border: '6px dashed var(--color-terracotta)',
              margin: '0 auto 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              animation: isSpinning ? 'spin 0.4s linear infinite' : 'none'
            }}
          >
            🎡
          </div>

          <h3 style={{ marginBottom: '8px' }}>
            {isSpinning ? 'Gathering Earth Energy...' : spinResult ? `You Won +${spinResult} Seeds!` : 'Ready for Your Daily Spin'}
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: '1.5rem' }}>
            {spinResult
              ? 'Your seeds have been deposited directly into your balance.'
              : 'Every spin is guaranteed to award between 50 and 300 seeds.'}
          </p>

          <Button
            variant="terracotta"
            size="lg"
            onClick={handleSpinWheel}
            loading={isSpinning}
            disabled={isSpinning}
          >
            {spinResult ? 'Spin Again Tomorrow' : 'Trigger Wheel Spin'}
          </Button>
        </div>
      </Modal>

      {/* 2. Modal: Eco Quiz */}
      <Modal
        isOpen={activeGameModal === 'quiz'}
        onClose={() => setActiveGameModal(null)}
        title="Eco & Craft Knowledge Quiz"
        maxWidth="500px"
      >
        {!quizFinished ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: '1rem' }}>
              <span>Question {quizIndex + 1} of {SAMPLE_QUIZ_QUESTIONS.length}</span>
              <span>Score: {quizScore}</span>
            </div>

            <h4 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', lineHeight: 1.4 }}>
              {SAMPLE_QUIZ_QUESTIONS[quizIndex].question}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
              {SAMPLE_QUIZ_QUESTIONS[quizIndex].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectQuizOption(i)}
                  style={{
                    textAlign: 'left',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: selectedOption === i ? 'var(--color-eucalyptus-light)' : 'var(--color-white)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <CheckCircle2 size={48} color="var(--color-sage)" style={{ margin: '0 auto 12px' }} />
            <h3>Quiz Completed!</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', margin: '8px 0 1.5rem' }}>
              You answered {quizScore} out of {SAMPLE_QUIZ_QUESTIONS.length} questions correctly and earned <strong>+200 Seeds</strong>!
            </p>
            <Button variant="charcoal" onClick={() => setActiveGameModal(null)}>
              Return to Play & Earn
            </Button>
          </div>
        )}
      </Modal>

      {/* 3. Modal: Circular Pledge */}
      <Modal
        isOpen={activeGameModal === 'pledge'}
        onClose={() => setActiveGameModal(null)}
        title="Zero-Waste Artisan Pledge"
        maxWidth="460px"
      >
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <Trees size={48} color="var(--color-terracotta)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ marginBottom: '8px' }}>I Pledge for Longevity</h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            "I commit to cherishing handmade objects, repairing before replacing, and returning eligible
            goods to the VELOCE Circular Market to keep our planet green."
          </p>
          <Button variant="terracotta" size="lg" onClick={handleTakePledge}>
            Confirm Pledge & Harvest +300 Seeds
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default PlayEarn;
