"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface GalleryItem {
  id: string;
  imageUrl: string;
  category: string;
  submitter: string;
  timestamp: number;
  verified: boolean;
  popularityScore: number;
  verificationScore: number;
  nftContract: string;
  tokenId: number;
}

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "live-camera", label: "Live Camera" },
    { value: "ai-generated", label: "AI Generated" },
    { value: "digital-art", label: "Digital Art" },
    { value: "photography", label: "Photography" },
    { value: "screenshot", label: "Screenshot" },
    { value: "other", label: "Other" }
  ];

  const sortOptions = [
    { value: "popularity", label: "Most Popular" },
    { value: "recent", label: "Most Recent" },
    { value: "verified", label: "Verified Only" }
  ];

  // Mock data - in a real implementation, this would fetch from the blockchain
  useEffect(() => {
    const mockItems: GalleryItem[] = [
      {
        id: "1",
        imageUrl: "https://picsum.photos/400/300?random=1",
        category: "photography",
        submitter: "0x1234...5678",
        timestamp: Date.now() - 86400000,
        verified: true,
        popularityScore: 45,
        verificationScore: 8,
        nftContract: "0xabcd...efgh",
        tokenId: 1
      },
      {
        id: "2",
        imageUrl: "https://picsum.photos/400/300?random=2",
        category: "ai-generated",
        submitter: "0x2345...6789",
        timestamp: Date.now() - 172800000,
        verified: true,
        popularityScore: 32,
        verificationScore: 6,
        nftContract: "0xbcde...fghi",
        tokenId: 2
      },
      {
        id: "3",
        imageUrl: "https://picsum.photos/400/300?random=3",
        category: "digital-art",
        submitter: "0x3456...789a",
        timestamp: Date.now() - 259200000,
        verified: false,
        popularityScore: 18,
        verificationScore: 3,
        nftContract: "0xcdef...ghij",
        tokenId: 3
      },
      {
        id: "4",
        imageUrl: "https://picsum.photos/400/300?random=4",
        category: "live-camera",
        submitter: "0x4567...89ab",
        timestamp: Date.now() - 345600000,
        verified: true,
        popularityScore: 67,
        verificationScore: 9,
        nftContract: "0xdefg...hijk",
        tokenId: 4
      },
      {
        id: "5",
        imageUrl: "https://picsum.photos/400/300?random=5",
        category: "screenshot",
        submitter: "0x5678...9abc",
        timestamp: Date.now() - 432000000,
        verified: false,
        popularityScore: 12,
        verificationScore: 2,
        nftContract: "0xefgh...ijkl",
        tokenId: 5
      },
      {
        id: "6",
        imageUrl: "https://picsum.photos/400/300?random=6",
        category: "photography",
        submitter: "0x6789...abcd",
        timestamp: Date.now() - 518400000,
        verified: true,
        popularityScore: 89,
        verificationScore: 12,
        nftContract: "0xfghi...jklm",
        tokenId: 6
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setGalleryItems(mockItems);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredItems = galleryItems.filter(item => 
    selectedCategory === "all" || item.category === selectedCategory
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return b.popularityScore - a.popularityScore;
      case "recent":
        return b.timestamp - a.timestamp;
      case "verified":
        if (a.verified && !b.verified) return -1;
        if (!a.verified && b.verified) return 1;
        return b.popularityScore - a.popularityScore;
      default:
        return 0;
    }
  });

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
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
              <h1 className="text-2xl font-bold text-gray-900 ml-4">Image Gallery</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/submit" className="text-gray-600 hover:text-gray-900 font-medium">
                Submit Image
              </Link>
              <Link href="/leaderboard" className="text-gray-600 hover:text-gray-900 font-medium">
                Leaderboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{galleryItems.length}</div>
            <div className="text-sm text-gray-600">Total Images</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {galleryItems.filter(item => item.verified).length}
            </div>
            <div className="text-sm text-gray-600">Verified</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(galleryItems.map(item => item.submitter)).size}
            </div>
            <div className="text-sm text-gray-600">Contributors</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {new Set(galleryItems.map(item => item.category)).size}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={item.imageUrl}
                    alt={`Provenance image ${item.id}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    {item.verified && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <div>By: {formatAddress(item.submitter)}</div>
                    <div>{formatTimestamp(item.timestamp)}</div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.994a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      {item.popularityScore}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {item.verificationScore}
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-400">
                    NFT: {formatAddress(item.nftContract)} #{item.tokenId}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && sortedItems.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No images found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedCategory === "all" 
                ? "No images have been submitted yet." 
                : `No images found in the ${categories.find(c => c.value === selectedCategory)?.label} category.`
              }
            </p>
            <div className="mt-6">
              <Link
                href="/submit"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Submit First Image
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
