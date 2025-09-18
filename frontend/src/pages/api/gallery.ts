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
    // Load demo data for immediate testing
    // In a real implementation, this would fetch from:
    // 1. IPFS for image metadata
    // 2. Blockchain for verification status
    // 3. Database for popularity scores
    
    const demoData = await import('../../../public/demo-data.json');
    
    const galleryData: GalleryData = {
      images: demoData.default.images,
      categories: demoData.default.categories,
      lastUpdated: demoData.default.lastUpdated
    };

    res.status(200).json(galleryData);

  } catch (error) {
    console.error('Error fetching gallery data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
