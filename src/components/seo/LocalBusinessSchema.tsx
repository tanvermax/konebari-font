// components/seo/LocalBusinessSchema.tsx
export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "JCS Trading",
    "image": "https://your-domain.com/logo.png", // Replace with your actual logo URL
    "@id": "https://your-domain.com",
    "url": "https://your-domain.com",
    "telephone": "+8801674986600",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Shop 02, Silver Rain Tower",
      "addressLocality": "Sonirakhra",
      "addressRegion": "Dhaka",
      "postalCode": "1362",
      "addressCountry": "BD"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "10:00",
        "closes": "21:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/share/1SDTmgM62M/"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}