import { NextApiRequest, NextApiResponse } from 'next';

interface GalleryData {
  images: Array<{
    id: string;
    imageUrl: string;
    category: string;
    submitter: string;
    timestamp: number;
    verified: boolean;
    popularityScore: number;
    verificationScore: number;
    proofHash: string;
  }>;
  categories: Record<string, string[]>;
  lastUpdated: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GalleryData | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // In a real implementation, this would fetch from:
    // 1. IPFS for image metadata
    // 2. Blockchain for verification status
    // 3. Database for popularity scores
    
    const galleryData: GalleryData = {
      images: [
        {
          id: "1",
          imageUrl: "https://picsum.photos/400/300?random=1",
          category: "photography",
          submitter: "0x1234...5678",
          timestamp: Date.now() - 86400000,
          verified: true,
          popularityScore: 45,
          verificationScore: 8,
          proofHash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2"
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
          proofHash: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3"
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
          proofHash: "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4"
        }
      ],
      categories: {
        "photography": ["1"],
        "ai-generated": ["2"],
        "digital-art": ["3"]
      },
      lastUpdated: new Date().toISOString()
    };

    res.status(200).json(galleryData);

  } catch (error) {
    console.error('Error fetching gallery data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
