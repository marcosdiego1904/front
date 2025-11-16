import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../../src/auth/context/AuthContext'
import { biblicalRanks, calculateUserRank, BiblicalRank } from '../../../src/utils/RankingSystem'
import axios from 'axios'
import API_BASE_URL from '../../../src/config/api'
import {
  staggerContainer,
  fadeInUp,
  scaleInSpring,
  cardHover,
  buttonHover,
  buttonTap
} from '../../../src/lib/animations'
import './RanksPage.css'

interface LeaderboardEntry {
  userId: string
  username: string
  versesCount: number
  rank: number
  rankLevel: string
  rankIcon: React.ReactNode
  isCurrentUser: boolean
}

export default function RanksPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, getAuthHeader } = useAuth()
  const [memorizedVerses, setMemorizedVerses] = useState<any[]>([])
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userRankData, setUserRankData] = useState({
    currentRank: biblicalRanks[0],
    progress: 0,
    versesToNextRank: 1,
    versesCount: 0,
    currentRankIndex: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false)
        return
      }

      try {
        // Fetch memorized verses
        const versesResponse = await axios.get(
          `${API_BASE_URL}/user/memorized-verses`,
          { headers: getAuthHeader() }
        )

        let processedVerses: any[] = []
        if (versesResponse.data?.verses && Array.isArray(versesResponse.data.verses)) {
          processedVerses = versesResponse.data.verses
        } else if (Array.isArray(versesResponse.data)) {
          processedVerses = versesResponse.data
        } else if (versesResponse.data?.data && Array.isArray(versesResponse.data.data)) {
          processedVerses = versesResponse.data.data
        }

        setMemorizedVerses(processedVerses)

        // Calculate user rank
        const versesCount = processedVerses.length
        const calculated = calculateUserRank(versesCount)
        const currentRankIndex = biblicalRanks.findIndex(rank => rank.level === calculated.currentRank.level)

        setUserRankData({
          currentRank: calculated.currentRank,
          progress: calculated.progress,
          versesToNextRank: calculated.versesToNextRank,
          versesCount,
          currentRankIndex
        })

        // Fetch leaderboard
        try {
          const leaderboardResponse = await axios.get(
            `${API_BASE_URL}/ranking`,
            { headers: getAuthHeader() }
          )

          console.log('Leaderboard API response:', leaderboardResponse.data)

          // Process leaderboard data - handle multiple possible response formats
          let leaderboard = []

          if (Array.isArray(leaderboardResponse.data)) {
            leaderboard = leaderboardResponse.data
          } else if (leaderboardResponse.data?.rankings && Array.isArray(leaderboardResponse.data.rankings)) {
            leaderboard = leaderboardResponse.data.rankings
          } else if (leaderboardResponse.data?.data && Array.isArray(leaderboardResponse.data.data)) {
            leaderboard = leaderboardResponse.data.data
          } else if (leaderboardResponse.data?.leaderboard && Array.isArray(leaderboardResponse.data.leaderboard)) {
            leaderboard = leaderboardResponse.data.leaderboard
          }

          if (leaderboard.length === 0) {
            console.warn('Leaderboard API returned empty data')
            setLeaderboardData([])
          } else {
            const processedLeaderboard: LeaderboardEntry[] = leaderboard.map((entry: any, index: number) => {
              const versesCount = entry.versesCount || entry.verses_count || entry.memorized_verses || 0
              const entryRank = calculateUserRank(versesCount)
              const userId = entry.userId || entry.user_id || entry.id || entry._id
              const username = entry.username || entry.name || entry.displayName || 'Unknown User'

              return {
                userId: String(userId),
                username,
                versesCount,
                rank: entry.rank || entry.position || index + 1,
                rankLevel: entryRank.currentRank.level,
                rankIcon: entryRank.currentRank.icon,
                isCurrentUser: String(userId) === String(user?.id) || username === user?.username
              }
            })

            setLeaderboardData(processedLeaderboard)
          }
        } catch (leaderboardError: any) {
          console.error('Error fetching leaderboard:', leaderboardError)
          console.error('Error details:', {
            message: leaderboardError?.message,
            response: leaderboardError?.response?.data,
            status: leaderboardError?.response?.status
          })
          // Don't show mock data - show empty state instead
          setLeaderboardData([])
        }

      } catch (error) {
        console.error('Error fetching rank data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated, getAuthHeader, user])

  const getRankIcon = (rankLevel: string) => {
    const rank = biblicalRanks.find(r => r.level === rankLevel)
    return rank?.icon || null
  }

  if (!isAuthenticated) {
    return (
      <div className="ranks-page-container">
        <div className="ranks-auth-required">
          <motion.div
            className="auth-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2>🕊️ Join Your Biblical Journey</h2>
            <p>Create an account to start tracking your spiritual transformation</p>
            <div className="auth-buttons">
              <button onClick={() => navigate('/register')} className="primary-btn">
                Start for Free
              </button>
              <button onClick={() => navigate('/login')} className="secondary-btn">
                Log In
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="ranks-page-container">
      {/* Hero Section */}
      <motion.section
        className="ranks-hero-section"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Animated background orbs */}
        <div className="hero-background">
          <motion.div
            className="background-orb orb-1"
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="background-orb orb-2"
            animate={{
              y: [0, 30, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="background-orb orb-3"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="hero-content">
          <motion.div variants={fadeInUp} className="hero-badge">
            <span className="badge-emoji">🕊️</span>
            <span className="badge-text">Your Spiritual Rank Awaits</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="hero-title">
            Your Biblical Journey
          </motion.h1>

          <motion.p variants={fadeInUp} className="hero-subtitle">
            Track your transformation from Seeker to Sage
          </motion.p>
        </div>
      </motion.section>

      {/* Current Rank Card (Hero Display) */}
      <motion.div
        className="current-rank-hero"
        variants={scaleInSpring}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="rank-hero-card">
          {/* Rank Icon (Large) */}
          <div className="rank-icon-large">
            <div className="icon-container">
              {userRankData.currentRank.icon}
            </div>
          </div>

          {/* Rank Name */}
          <h2 className="rank-name-large">{userRankData.currentRank.level}</h2>

          {/* Subtitle */}
          <p className="rank-subtitle">
            {userRankData.currentRank.level === "Nicodemus" && "The Seeker"}
            {userRankData.currentRank.level === "Thomas" && "The Doubter"}
            {userRankData.currentRank.level === "Peter" && "The Follower"}
            {userRankData.currentRank.level === "John" && "The Beloved"}
            {userRankData.currentRank.level === "Paul" && "The Transformed"}
            {userRankData.currentRank.level === "David" && "The Worshipper"}
            {userRankData.currentRank.level === "Daniel" && "The Faithful"}
            {userRankData.currentRank.level === "Solomon" && "The Wise King"}
          </p>

          {/* Phrase */}
          <p className="rank-phrase-large">
            "{userRankData.currentRank.phrase}"
          </p>

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar-bg">
              <motion.div
                className="progress-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${userRankData.progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>

            {/* Stats */}
            <div className="progress-stats">
              <span className="verses-count">
                {userRankData.versesCount} verses memorized
              </span>
              {userRankData.currentRank.nextLevel && (
                <span className="verses-remaining">
                  {userRankData.versesToNextRank} more to reach {userRankData.currentRank.nextLevel}
                </span>
              )}
            </div>
          </div>

          {/* Social Proof */}
          <div className="social-proof-badge">
            <p>
              🏆 You're on a journey few complete. Keep going!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Rank Journey Path (Visual Timeline) */}
      <motion.section
        className="journey-path-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <motion.h3 variants={fadeInUp} className="section-title">
          Your Path to Wisdom
        </motion.h3>

        <div className="journey-path-container">
          {/* Connecting Line */}
          <div className="journey-line-bg" />
          <motion.div
            className="journey-line-progress"
            initial={{ width: 0 }}
            whileInView={{ width: `${(userRankData.currentRankIndex / (biblicalRanks.length - 1)) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />

          {/* Rank Nodes */}
          <div className="journey-nodes">
            {biblicalRanks.map((rank, index) => {
              const isCompleted = index < userRankData.currentRankIndex
              const isCurrent = index === userRankData.currentRankIndex
              const isLocked = index > userRankData.currentRankIndex

              return (
                <motion.div
                  key={rank.level}
                  className="journey-node"
                  variants={fadeInUp}
                  custom={index}
                >
                  {/* Node Circle */}
                  <div
                    className={`node-circle ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}`}
                  >
                    {isCompleted && <span className="checkmark">✓</span>}
                    {isCurrent && <div className="node-icon">{rank.icon}</div>}
                    {isLocked && <span className="lock-icon">🔒</span>}
                  </div>

                  {/* Label */}
                  <span className={`node-label ${isCurrent ? 'current-label' : ''}`}>
                    {rank.level}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* Leaderboard */}
      <motion.section
        className="leaderboard-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <motion.h3 variants={fadeInUp} className="section-title">
          Where You Stand
        </motion.h3>

        <motion.div variants={fadeInUp} className="leaderboard-card">
          {/* Header */}
          <div className="leaderboard-header">
            <div className="header-rank">Rank</div>
            <div className="header-user">User</div>
            <div className="header-verses">Verses</div>
          </div>

          {/* Rows */}
          <div className="leaderboard-rows">
            {isLoading ? (
              <div className="leaderboard-loading">
                <div className="loading-spinner" />
                <p>Loading rankings...</p>
              </div>
            ) : leaderboardData.length > 0 ? (
              leaderboardData.map((entry) => (
                <motion.div
                  key={entry.userId}
                  className={`leaderboard-row ${entry.isCurrentUser ? 'current-user-row' : ''}`}
                  whileHover={{ backgroundColor: '#FEF3C7' }}
                >
                  <div className="row-rank">#{entry.rank}</div>
                  <div className="row-user">
                    <span className="user-icon">{entry.rankIcon}</span>
                    <span className="user-name">{entry.username}</span>
                    {entry.isCurrentUser && <span className="you-badge">YOU</span>}
                  </div>
                  <div className="row-verses">{entry.versesCount} verses</div>
                </motion.div>
              ))
            ) : (
              <div className="leaderboard-empty">
                <p>No leaderboard data available yet.</p>
                <p style={{ fontSize: '0.9em', marginTop: '8px', opacity: 0.8 }}>
                  Start memorizing verses to appear on the leaderboard!
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Social Proof */}
        {!isLoading && leaderboardData.length > 0 && (
          <motion.div variants={fadeInUp} className="leaderboard-stats">
            <p>
              Join <strong>thousands of believers</strong> on their journey to memorize Scripture
            </p>
          </motion.div>
        )}
      </motion.section>

      {/* All Ranks Showcase */}
      <motion.section
        className="all-ranks-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <motion.h3 variants={fadeInUp} className="section-title">
          The Complete Journey
        </motion.h3>

        <motion.div
          className="ranks-grid"
          variants={staggerContainer}
        >
          {biblicalRanks.map((rank, index) => {
            const isLocked = index > userRankData.currentRankIndex
            const isCurrent = index === userRankData.currentRankIndex
            const isCompleted = index < userRankData.currentRankIndex

            return (
              <motion.div
                key={rank.level}
                className={`rank-card ${isCurrent ? 'current-rank-card' : ''} ${isCompleted ? 'completed-rank-card' : ''}`}
                variants={scaleInSpring}
                whileHover={!isLocked ? cardHover : {}}
              >
                {/* Icon */}
                <div className="rank-card-icon">
                  <div className={`icon-bg ${isCurrent ? 'icon-current' : ''}`}>
                    {rank.icon}
                  </div>
                </div>

                {/* Name */}
                <h4 className="rank-card-name">{rank.level}</h4>

                {/* Verse Range */}
                <p className="rank-card-range">
                  {rank.minVerses} - {rank.maxVerses === 100 ? '100' : rank.maxVerses} verses
                </p>

                {/* Phrase */}
                <p className="rank-card-phrase">
                  "{rank.phrase}"
                </p>

                {/* Status Badge */}
                {isCompleted && (
                  <div className="rank-status completed-status">
                    <span>✓ Achieved</span>
                  </div>
                )}
                {isCurrent && (
                  <div className="rank-status current-status">
                    <span>⭐ Current</span>
                  </div>
                )}
                {isLocked && (
                  <div className="rank-status locked-status">
                    <span>🔒 Locked</span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="ranks-cta-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="cta-content">
          <h3>Continue Your Journey</h3>
          <p>The next verse is waiting. Keep climbing.</p>
          <motion.button
            className="cta-button"
            onClick={() => navigate('/learn')}
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            Start Learning →
          </motion.button>
        </motion.div>
      </motion.section>
    </div>
  )
}
