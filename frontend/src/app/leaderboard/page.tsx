"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface LeaderboardEntry {
  address: string;
  totalSubmissions: number;
  verifiedSubmissions: number;
  totalPopularityScore: number;
  averageVerificationScore: number;
  rank: number;
}

interface CategoryStats {
  category: string;
  count: number;
  verifiedCount: number;
  totalPopularity: number;
}

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState("all");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);

  const timeframes = [
    { value: "all", label: "All Time" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" }
  ];

  // Mock data - in a real implementation, this would fetch from the blockchain
  useEffect(() => {
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        address: "0x1234...5678",
        totalSubmissions: 15,
        verifiedSubmissions: 12,
        totalPopularityScore: 450,
        averageVerificationScore: 8.5,
        rank: 1
      },
      {
        address: "0x2345...6789",
        totalSubmissions: 12,
        verifiedSubmissions: 10,
        totalPopularityScore: 380,
        averageVerificationScore: 7.8,
        rank: 2
      },
      {
        address: "0x3456...789a",
        totalSubmissions: 8,
        verifiedSubmissions: 6,
        totalPopularityScore: 320,
        averageVerificationScore: 8.2,
        rank: 3
      },
      {
        address: "0x4567...89ab",
        totalSubmissions: 10,
        verifiedSubmissions: 8,
        totalPopularityScore: 290,
        averageVerificationScore: 7.5,
        rank: 4
      },
      {
        address: "0x5678...9abc",
        totalSubmissions: 6,
        verifiedSubmissions: 5,
        totalPopularityScore: 250,
        averageVerificationScore: 8.0,
        rank: 5
      },
      {
        address: "0x6789...abcd",
        totalSubmissions: 7,
        verifiedSubmissions: 4,
        totalPopularityScore: 220,
        averageVerificationScore: 7.2,
        rank: 6
      },
      {
        address: "0x789a...bcde",
        totalSubmissions: 5,
        verifiedSubmissions: 3,
        totalPopularityScore: 180,
        averageVerificationScore: 7.8,
        rank: 7
      },
      {
        address: "0x89ab...cdef",
        totalSubmissions: 4,
        verifiedSubmissions: 3,
        totalPopularityScore: 150,
        averageVerificationScore: 8.5,
        rank: 8
      }
    ];

    const mockCategoryStats: CategoryStats[] = [
      { category: "photography", count: 25, verifiedCount: 20, totalPopularity: 1200 },
      { category: "ai-generated", count: 18, verifiedCount: 15, totalPopularity: 950 },
      { category: "digital-art", count: 12, verifiedCount: 8, totalPopularity: 600 },
      { category: "live-camera", count: 8, verifiedCount: 6, totalPopularity: 450 },
      { category: "screenshot", count: 5, verifiedCount: 3, totalPopularity: 200 },
      { category: "other", count: 3, verifiedCount: 2, totalPopularity: 120 }
    ];

    // Simulate loading
    setTimeout(() => {
      setLeaderboardData(mockLeaderboard);
      setCategoryStats(mockCategoryStats);
      setLoading(false);
    }, 1000);
  }, [timeframe]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-600 bg-yellow-50";
      case 2:
        return "text-gray-600 bg-gray-50";
      case 3:
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                ← Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 ml-4">Leaderboard</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/gallery" className="text-gray-600 hover:text-gray-900 font-medium">
                Gallery
              </Link>
              <Link href="/submit" className="text-gray-600 hover:text-gray-900 font-medium">
                Submit Image
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Timeframe Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Top Contributors</h2>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {timeframes.map((tf) => (
                <option key={tf.value} value={tf.value}>
                  {tf.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {leaderboardData.map((entry) => (
                    <div key={entry.address} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${getRankColor(entry.rank)}`}>
                            {getRankIcon(entry.rank)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {formatAddress(entry.address)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {entry.verifiedSubmissions}/{entry.totalSubmissions} verified
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {entry.totalPopularityScore} points
                          </div>
                          <div className="text-sm text-gray-500">
                            Avg: {entry.averageVerificationScore.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Category Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Statistics</h3>
              <div className="space-y-3">
                {categoryStats.map((stat) => (
                  <div key={stat.category} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {stat.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      <div className="text-xs text-gray-500">
                        {stat.verifiedCount}/{stat.count} verified
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {stat.totalPopularity}
                      </div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rewards Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rewards Program</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified submissions earn Nexus testnet tokens
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Top contributors receive special NFT rewards
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Community voting determines verification status
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href="/submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Start Contributing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
