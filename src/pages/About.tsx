import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { 
  Car, 
  ShieldCheck, 
  Gauge, 
  Globe, 
  MapPin, 
  Clock, 
  Music, 
  Heart,
  ArrowRight
} from "lucide-react";

export default function About() {
  return (
    <div className="py-20 px-4 container mx-auto max-w-6xl space-y-24">
      
      {/* Hero Section - Refined with better spacing and gradient text */}
      <section className="text-center space-y-6">
        <Badge variant="secondary" className="rounded-full px-6 py-1 text-sm font-medium">
          Established 2024
        </Badge>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">
          Elevating Your <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">Lifestyle</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
          Welcome to JCS Trading, where quality meets variety. Based in Bangladesh, 
          we specialize in sourcing essential products that enhance your daily life—whether 
          you’re behind the wheel, relaxing with your pet, or creating music.
        </p>
      </section>

      {/* Modern Grid Section - Category Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <CategoryCard 
          icon={<Car className="w-6 h-6" />}
          title="Automotive Excellence"
          description="High-quality car accessories designed to keep your vehicle safe, stylish, and smelling fresh."
        />
        <CategoryCard 
          icon={<Heart className="w-6 h-6" />}
          title="Feline Care"
          description="Nutritious cat food and engaging accessories for your furry companions to thrive."
        />
        <CategoryCard 
          icon={<Music className="w-6 h-6" />}
          title="Musical Precision"
          description="Essential accessories for instruments to keep your sound perfect and your gear protected."
        />
      </div>

      {/* Mission Section with Interactive Image Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold tracking-tight">Our Mission</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We realized that modern life is multifaceted. You aren't just a driver; you’re a pet parent and a creator. 
            At JCS Trading, our mission is simple: to provide the Bangladeshi market with 100% authentic products, 
            competitive pricing, and a seamless shopping experience.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {[
              { icon: <ShieldCheck className="text-primary" />, text: "Quality Tested" },
              { icon: <Gauge className="text-primary" />, text: "Performance Driven" },
              { icon: <Globe className="text-primary" />, text: "Nationwide Delivery" },
              { icon: <Clock className="text-primary" />, text: "24/7 Support" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-xl border bg-card/50">
                {item.icon}
                <span className="font-semibold text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-transparent rounded-[2rem] blur-2xl group-hover:opacity-50 transition duration-700"></div>
          <div className="relative aspect-square md:aspect-video rounded-3xl overflow-hidden shadow-2xl border">
             <img 
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000" 
                alt="Premium Products" 
                className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
             />
          </div>
        </div>
      </div>

      {/* Store Location Section - Added Shop Address */}
      <section className="bg-muted/30 border rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-primary font-bold tracking-wider uppercase text-xs">
              <MapPin className="w-4 h-4" /> Visit Our Flagship Store
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Come Experience Quality In Person</h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-background rounded-2xl border shadow-sm w-fit">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-lg">Shop 02, Silver Rain Tower</p>
                  <p className="text-muted-foreground">Sonirakhra, Dhaka 1362, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-background/80 backdrop-blur-md p-6 rounded-3xl border shadow-xl flex flex-col items-center text-center space-y-4">
             <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Clock className="w-8 h-8" />
             </div>
             <div>
                <h4 className="font-bold text-xl">Store Hours</h4>
                <p className="text-muted-foreground">Open Daily: 10:00 AM - 9:00 PM</p>
                <p className="text-xs text-primary mt-2 font-medium underline cursor-pointer">Get Directions on Maps</p>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[
          { title: "5k+", label: "Happy Customers", icon: <Car /> },
          { title: "500+", label: "Curated Items", icon: <Gauge /> },
          { title: "24/7", label: "Expert Help", icon: <ShieldCheck /> },
          { title: "100%", label: "Authentic", icon: <Globe /> },
        ].map((stat, i) => (
          <div key={i} className="text-center space-y-2 p-6 rounded-2xl hover:bg-muted transition-colors">
            <h3 className="text-4xl md:text-5xl font-black text-primary/20 group-hover:text-primary/40 transition-colors">
              {stat.title}
            </h3>
            <p className="font-bold text-lg">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Call to Action - Elevated with glassmorphism */}
      <section className="relative overflow-hidden bg-primary rounded-[3rem] p-12 text-primary-foreground text-center">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to Upgrade Your Life?</h2>
          <p className="text-lg opacity-90">
            Join thousands of satisfied customers in Bangladesh who have transformed their journey with JCS Trading.
          </p>
          <button className="inline-flex items-center gap-2 bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all active:scale-95">
            Browse Collection <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="group border-none bg-muted/40 hover:bg-primary transition-all duration-500 cursor-default">
      <CardContent className="p-8 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-primary group-hover:bg-white text-white group-hover:text-primary flex items-center justify-center transition-colors duration-500 shadow-lg shadow-primary/20">
          {icon}
        </div>
        <h3 className="text-2xl font-bold group-hover:text-white transition-colors">{title}</h3>
        <p className="text-muted-foreground group-hover:text-white/80 transition-colors leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}