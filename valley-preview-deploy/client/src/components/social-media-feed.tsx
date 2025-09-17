import { useState } from "react";
import { Instagram, Facebook, Twitter, Youtube, Heart, MessageCircle, Share2, Play } from "lucide-react";

interface SocialPost {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'youtube';
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  link: string;
}

export default function SocialMediaFeed() {
  const [activeTab, setActiveTab] = useState<'instagram' | 'facebook' | 'twitter' | 'youtube'>('instagram');

  const socialPosts: SocialPost[] = [
    {
      id: "1",
      platform: "instagram",
      content: "New arrival alert! 🚨 Introducing Tom Ford Noir Extreme - a masterpiece of sophistication and warmth ✨ Perfect for the modern connoisseur who appreciates depth and complexity in their signature scent.",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop&auto=format&q=90",
      likes: 847,
      comments: 23,
      shares: 12,
      timestamp: "2 hours ago",
      link: "https://instagram.com/valleybreezesperfumes"
    },
    {
      id: "2",
      platform: "instagram",
      content: "Fragrance 101: Understanding Notes 📚 Swipe to learn the difference between top, middle, and base notes ✨ Knowledge is power when choosing your perfect scent!",
      image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=600&h=600&fit=crop&auto=format&q=90",
      likes: 564,
      comments: 45,
      shares: 28,
      timestamp: "1 day ago",
      link: "https://instagram.com/valleybreezesperfumes"
    },
    {
      id: "3",
      platform: "facebook",
      content: "The Art of Layering Fragrances: Creating Your Unique Signature Scent. Discover how combining different fragrances can create a personalized olfactory experience that's uniquely yours.",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=400&fit=crop&auto=format&q=90",
      likes: 234,
      comments: 18,
      shares: 42,
      timestamp: "3 hours ago",
      link: "https://facebook.com/ValleyBreezesPerfumes"
    },
    {
      id: "4",
      platform: "twitter",
      content: "Pro tip: Apply fragrance to pulse points - wrists, neck, behind ears. The warmth helps diffuse the scent beautifully throughout the day ✨ #FragranceTips #PerfumeLovers",
      likes: 89,
      comments: 12,
      shares: 34,
      timestamp: "4 hours ago",
      link: "https://twitter.com/ValleyBreezes"
    },
    {
      id: "5",
      platform: "youtube",
      content: "In-Depth Review: Creed Aventus - Is it worth the hype? Join us as we break down this iconic fragrance note by note.",
      image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&h=400&fit=crop&auto=format&q=90",
      likes: 156,
      comments: 67,
      shares: 23,
      timestamp: "2 days ago",
      link: "https://youtube.com/@valleybreezesperfumes"
    }
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      default: return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'text-pink-500';
      case 'facebook': return 'text-blue-600';
      case 'twitter': return 'text-blue-400';
      case 'youtube': return 'text-red-500';
      default: return 'text-primary';
    }
  };

  const filteredPosts = socialPosts.filter(post => post.platform === activeTab);

  return (
    <section className="px-6 py-24 bg-gradient-to-b from-background/30 to-background/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gradient mb-6">
            Follow Our Journey
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            Stay connected with Valley Breezes on social media for the latest fragrance releases, expert tips, and behind-the-scenes content.
          </p>
        </div>

        {/* Social Media Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-full p-2 inline-flex gap-2">
            {['instagram', 'facebook', 'twitter', 'youtube'].map((platform) => (
              <button
                key={platform}
                onClick={() => setActiveTab(platform as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === platform
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                }`}
              >
                {getPlatformIcon(platform)}
                <span className="capitalize hidden sm:inline">{platform}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Social Media Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="group cursor-pointer transition-all duration-500 hover:-translate-y-2"
            >
              <div className="bg-gradient-to-br from-card/80 via-background/60 to-card/70 backdrop-blur-lg border border-primary/20 rounded-2xl overflow-hidden group-hover:shadow-2xl group-hover:shadow-primary/25 group-hover:border-primary/40 transition-all duration-500">
                
                {/* Post Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center ${getPlatformColor(post.platform)}`}>
                      {getPlatformIcon(post.platform)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Valley Breezes</h3>
                      <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                    </div>
                  </div>
                </div>

                {/* Post Image */}
                {post.image && (
                  <div className="relative">
                    <img 
                      src={post.image} 
                      alt="Social media post" 
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {post.platform === 'youtube' && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-6 h-6 ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Post Content */}
                <div className="p-6 pt-4">
                  <p className="text-foreground/90 mb-4 text-sm leading-relaxed line-clamp-3">
                    {post.content}
                  </p>

                  {/* Engagement Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="w-4 h-4" />
                        <span>{post.shares}</span>
                      </div>
                    </div>
                  </div>

                  {/* View Post Button */}
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors duration-300 font-semibold text-sm group-hover:scale-105 transform"
                  >
                    View on {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                    <Share2 className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Follow Us CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 via-card/50 to-accent/10 backdrop-blur-lg border border-primary/20 rounded-3xl p-12 max-w-4xl mx-auto">
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-gradient mb-6">
              Join Our Fragrance Community
            </h3>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Follow us on social media for daily fragrance inspiration, expert tips, exclusive previews, and special offers for our community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://instagram.com/valleybreezesperfumes"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 hover:-translate-y-1"
              >
                <Instagram className="w-5 h-5" />
                Follow on Instagram
              </a>
              <a
                href="https://facebook.com/ValleyBreezesPerfumes"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-300 hover:-translate-y-1"
              >
                <Facebook className="w-5 h-5" />
                Like on Facebook
              </a>
              <a
                href="https://twitter.com/ValleyBreezes"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-400 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 hover:-translate-y-1"
              >
                <Twitter className="w-5 h-5" />
                Follow on Twitter
              </a>
              <a
                href="https://wa.me/971508897070?text=Hello%20Valley%20Breezes!%20I'm%20interested%20in%20your%20luxury%20fragrances."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:-translate-y-1"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}