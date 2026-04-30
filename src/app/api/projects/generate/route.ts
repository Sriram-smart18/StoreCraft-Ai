import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await req.json();
    const { type, inputs } = body; 

    // Artificial delay to simulate AI generation (2.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2500));

    let output: any = {};

    if (type === 'store') {
      const { brandName, productType, tone } = inputs;
      
      // Tone-based generation rules logic
      let toneAdjective = "premium";
      if (tone === "Luxury") toneAdjective = "exquisite";
      if (tone === "Minimal") toneAdjective = "essential";
      if (tone === "Bold") toneAdjective = "unapologetic";
      
      let typeFocus = "everyday life";
      if (productType === "Skincare") typeFocus = "natural beauty";
      if (productType === "Fitness") typeFocus = "active lifestyle";
      if (productType === "Tech") typeFocus = "digital workflow";
      if (productType === "Pet") typeFocus = "furry best friend's life";

      output = {
        homepageLayout: ['Hero Section', 'Why Choose Us', 'Featured Collection', 'Social Proof', 'Footer'],
        heroCopy: {
          headline: `Elevate your ${typeFocus} with ${brandName || 'our brand'}.`,
          subheadline: `Discover ${toneAdjective} products tailored to your needs.`,
          cta: "Explore Collection"
        },
        benefits: [
          { title: "Unmatched Quality", description: `Crafted for those who appreciate ${toneAdjective} design.` },
          { title: "Ethically Sourced", description: "We care about our footprint and our community." },
          { title: "Guaranteed Satisfaction", description: "Join thousands of happy customers today." }
        ]
      };
    } else if (type === 'product') {
      const { productName, features, audience } = inputs;
      output = {
        shortDescription: `Meet the ${productName}—the ultimate choice for ${audience || 'anyone'}.`,
        longDescription: `Experience the difference with the ${productName}. Packed with key features like ${features || 'everything you need'}, it's specifically engineered for ${audience || 'you'}. Say goodbye to compromises and hello to excellence.`,
        marketingHeadlines: [
          `Why the ${productName} is a Game Changer`,
          `Transform Your Routine with ${productName}`,
          `The #1 Choice for ${audience || 'You'}`
        ],
        bulletBenefits: [
          "Intuitive and easy to use",
          "Built to last",
          "Highly rated by industry experts"
        ]
      };
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    await connectToDatabase();
    
    const projectName = type === 'store' ? `${inputs.brandName || 'Untitled'} Store` : `${inputs.productName || 'Untitled'} Product`;

    const project = await Project.create({
      userId: payload.userId,
      type,
      name: projectName,
      inputs,
      output
    });

    return NextResponse.json({ project });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
