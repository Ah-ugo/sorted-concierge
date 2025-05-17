import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Mock function to get blog post data
async function getBlogPost(slug: string) {
  // In a real app, you would fetch this data from an API or database
  const posts = [
    {
      slug: "top-10-tourist-attractions-in-lagos",
      title: "Top 10 Tourist Attractions in Lagos",
      excerpt: "Discover the most exciting places to visit in Lagos, Nigeria's vibrant commercial capital.",
      content: `
        <p>Lagos, Nigeria's bustling commercial capital, offers a rich tapestry of experiences for tourists. From pristine beaches to historical landmarks, the city has something for everyone.</p>
        
        <h2>1. Lekki Conservation Centre</h2>
        <p>Home to the longest canopy walkway in Africa, this nature reserve offers a glimpse into Lagos's diverse ecosystem. Visitors can spot monkeys, birds, and other wildlife while enjoying the serene environment.</p>
        
        <h2>2. Nike Art Gallery</h2>
        <p>This five-story building houses one of the largest collections of Nigerian art. Founded by Nike Davies-Okundaye, the gallery showcases traditional and contemporary Nigerian art forms.</p>
        
        <h2>3. Tarkwa Bay</h2>
        <p>A sheltered beach accessible by boat, Tarkwa Bay is perfect for swimming, sunbathing, and water sports. Its relative seclusion makes it a peaceful retreat from the city's hustle and bustle.</p>
        
        <h2>4. National Museum</h2>
        <p>Located in Onikan, the National Museum houses a collection of Nigerian art and artifacts, including the famous Benin Bronzes and traditional Yoruba sculptures.</p>
        
        <h2>5. Terra Kulture</h2>
        <p>A cultural center that promotes Nigerian art, culture, and language. It hosts art exhibitions, plays, and cultural events throughout the year.</p>
        
        <h2>6. Freedom Park</h2>
        <p>Once a colonial prison, Freedom Park has been transformed into a leisure and recreation center. It hosts concerts, exhibitions, and other cultural events.</p>
        
        <h2>7. Lekki Market</h2>
        <p>A vibrant market where visitors can purchase traditional Nigerian crafts, fabrics, and souvenirs. Bargaining is expected, so come prepared to negotiate.</p>
        
        <h2>8. Badagry</h2>
        <p>Though technically outside Lagos, Badagry is a historical town known for its role in the transatlantic slave trade. Visitors can explore the Badagry Heritage Museum and the Point of No Return.</p>
        
        <h2>9. Kalakuta Republic Museum</h2>
        <p>The former home of Afrobeat pioneer Fela Kuti has been converted into a museum celebrating his life and music. It offers insights into Nigeria's political and musical history.</p>
        
        <h2>10. Elegushi Beach</h2>
        <p>One of Lagos's most popular beaches, Elegushi offers a lively atmosphere with music, food, and drinks. It's perfect for those looking to experience Lagos's vibrant beach culture.</p>
        
        <p>Whether you're interested in history, art, nature, or simply relaxing on the beach, Lagos has something to offer. With its rich cultural heritage and dynamic urban landscape, Nigeria's largest city is a destination worth exploring.</p>
      `,
      author: {
        name: "Chioma Okonkwo",
        image: "/placeholder.svg?height=100&width=100",
        bio: "Travel writer and Lagos enthusiast with over 10 years of experience exploring Nigeria's hidden gems.",
      },
      date: "May 10, 2023",
      readTime: "8 min read",
      image: "/placeholder.svg?height=600&width=1200",
      category: "Travel",
      relatedPosts: [
        {
          title: "Best Nigerian Cuisines to Try in Lagos",
          slug: "best-nigerian-cuisines-to-try-in-lagos",
          image: "/placeholder.svg?height=300&width=400",
        },
        {
          title: "A Weekend Itinerary for Abuja",
          slug: "a-weekend-itinerary-for-abuja",
          image: "/placeholder.svg?height=300&width=400",
        },
        {
          title: "Exploring Nigeria's Cultural Festivals",
          slug: "exploring-nigerias-cultural-festivals",
          image: "/placeholder.svg?height=300&width=400",
        },
      ],
    },
    {
      slug: "best-nigerian-cuisines-to-try-in-lagos",
      title: "Best Nigerian Cuisines to Try in Lagos",
      excerpt: "A culinary journey through the diverse and flavorful Nigerian dishes available in Lagos.",
      content: `
        <p>Nigerian cuisine is as diverse as its people, offering a rich tapestry of flavors, textures, and aromas. Lagos, being the melting pot of cultures in Nigeria, provides an excellent opportunity to explore the country's culinary landscape.</p>
        
        <h2>1. Jollof Rice</h2>
        <p>No culinary journey through Nigeria would be complete without trying Jollof Rice. This one-pot dish consists of rice cooked in a flavorful tomato sauce with various spices. It's often served at parties and celebrations, earning it the nickname "party jollof."</p>
        
        <h2>2. Egusi Soup</h2>
        <p>Made from ground melon seeds, Egusi Soup is a thick, protein-rich soup often prepared with leafy vegetables, meat, and fish. It's typically eaten with fufu, a starchy side dish made from cassava, yam, or plantain.</p>
        
        <h2>3. Suya</h2>
        <p>Suya is a popular street food consisting of skewered meat (usually beef) coated with a spicy peanut mix and grilled over an open flame. It's often served with sliced onions and tomatoes.</p>
        
        <h2>4. Moin Moin</h2>
        <p>This steamed bean pudding is made from peeled black-eyed peas, onions, and peppers. It can be plain or filled with ingredients like boiled eggs, fish, or corned beef.</p>
        
        <h2>5. Akara</h2>
        <p>Also known as bean cakes, Akara is made from peeled black-eyed peas ground into a paste, mixed with spices, and deep-fried. It's a popular breakfast item often served with pap (a type of corn porridge).</p>
        
        <h2>6. Pepper Soup</h2>
        <p>A spicy, watery soup made with a variety of meats or fish and a blend of Nigerian spices. It's known for its medicinal properties and is often consumed during cold weather or when feeling under the weather.</p>
        
        <h2>7. Pounded Yam and Vegetable Soup</h2>
        <p>Pounded yam is a smooth, starchy side dish made by boiling and then pounding yam until it reaches a dough-like consistency. It's typically eaten with various soups, such as Efo Riro (a vegetable soup made with spinach).</p>
        
        <h2>8. Boli and Fish</h2>
        <p>Boli is roasted plantain, often served with grilled fish and a spicy pepper sauce. It's a popular street food in Lagos, especially in the evenings.</p>
        
        <h2>9. Chin Chin</h2>
        <p>These are small, crunchy, fried pastries made from flour, sugar, and other ingredients. They're a popular snack and can be found in many Nigerian homes and stores.</p>
        
        <h2>10. Chapman</h2>
        <p>While not a food, Chapman is a non-alcoholic beverage that's popular in Nigeria. It's made from a mix of Fanta, Sprite, Angostura bitters, cucumber, and other ingredients, resulting in a refreshing, fruity drink.</p>
        
        <p>When in Lagos, be sure to visit local restaurants, or "bukas," for an authentic taste of Nigerian cuisine. Many high-end restaurants also offer traditional dishes with a modern twist. Whether you're a food enthusiast or a casual diner, Lagos's culinary scene has something to satisfy your palate.</p>
      `,
      author: {
        name: "Tunde Adebayo",
        image: "/placeholder.svg?height=100&width=100",
        bio: "Food critic and culinary expert specializing in West African cuisines.",
      },
      date: "June 15, 2023",
      readTime: "10 min read",
      image: "/placeholder.svg?height=600&width=1200",
      category: "Food",
      relatedPosts: [
        {
          title: "Top 10 Tourist Attractions in Lagos",
          slug: "top-10-tourist-attractions-in-lagos",
          image: "/placeholder.svg?height=300&width=400",
        },
        {
          title: "A Weekend Itinerary for Abuja",
          slug: "a-weekend-itinerary-for-abuja",
          image: "/placeholder.svg?height=300&width=400",
        },
        {
          title: "Exploring Nigeria's Cultural Festivals",
          slug: "exploring-nigerias-cultural-festivals",
          image: "/placeholder.svg?height=300&width=400",
        },
      ],
    },
    {
      slug: "a-weekend-itinerary-for-abuja",
      title: "A Weekend Itinerary for Abuja",
      excerpt: "Make the most of your weekend in Nigeria's capital city with this comprehensive itinerary.",
      content: `
        <p>Abuja, Nigeria's capital city, offers a blend of modern infrastructure, cultural attractions, and natural beauty. If you're planning a weekend trip to this planned city, here's an itinerary to help you make the most of your visit.</p>
        
        <h2>Friday Evening</h2>
        <p><strong>Arrival and Check-in:</strong> After arriving in Abuja, check into your hotel. The city offers a range of accommodation options, from luxury hotels to budget-friendly guesthouses.</p>
        
        <p><strong>Dinner at Wuse Market:</strong> Head to Wuse Market, one of Abuja's largest markets, for dinner. Here, you can sample local Nigerian dishes at one of the many food stalls or restaurants.</p>
        
        <h2>Saturday Morning</h2>
        <p><strong>Breakfast:</strong> Start your day with a hearty breakfast at your hotel or at one of the many cafes in the city.</p>
        
        <p><strong>Visit the National Mosque:</strong> Begin your sightseeing with a visit to the National Mosque, an impressive architectural landmark in the city. Non-Muslims are welcome outside prayer times, but remember to dress modestly.</p>
        
        <p><strong>Explore the National Christian Centre:</strong> Next, visit the National Christian Centre, another significant religious landmark in Abuja. The church's architecture is inspired by a crown of thorns.</p>
        
        <h2>Saturday Afternoon</h2>
        <p><strong>Lunch:</strong> Enjoy lunch at one of the restaurants in the city center. Abuja offers a variety of dining options, from local Nigerian cuisine to international dishes.</p>
        
        <p><strong>Visit the National Assembly:</strong> After lunch, head to the National Assembly, Nigeria's legislative building. While you may not be able to enter without prior arrangement, the building's exterior is worth seeing.</p>
        
        <p><strong>Explore Millennium Park:</strong> Spend the rest of the afternoon at Millennium Park, Abuja's largest public park. Designed by renowned architect Manfredi Nicoletti, the park offers a peaceful retreat from the city's hustle and bustle.</p>
        
        <h2>Saturday Evening</h2>
        <p><strong>Dinner and Nightlife:</strong> Abuja comes alive at night with numerous restaurants, bars, and clubs. Enjoy dinner at a restaurant of your choice, then experience the city's nightlife if you're so inclined.</p>
        
        <h2>Sunday Morning</h2>
        <p><strong>Breakfast:</strong> Start your day with breakfast at your hotel or a local cafe.</p>
        
        <p><strong>Visit Aso Rock:</strong> Aso Rock is a large outcrop of granite rock located on the outskirts of Abuja. It's a significant landmark and gives its name to the Presidential Complex, which is located at its foot.</p>
        
        <p><strong>Explore the Arts and Crafts Village:</strong> This is a great place to buy souvenirs. The village showcases Nigeria's rich cultural heritage through various arts and crafts.</p>
        
        <h2>Sunday Afternoon</h2>
        <p><strong>Lunch:</strong> Enjoy your last lunch in Abuja at a restaurant of your choice.</p>
        
        <p><strong>Visit the Abuja National Stadium:</strong> If you're a sports enthusiast, consider visiting the Abuja National Stadium, a multi-purpose stadium that hosts various sporting events.</p>
        
        <p><strong>Shopping at Jabi Lake Mall:</strong> Before leaving, spend some time shopping at Jabi Lake Mall, one of the largest shopping centers in Abuja.</p>
        
        <h2>Sunday Evening</h2>
        <p><strong>Departure:</strong> As your weekend in Abuja comes to an end, head to the airport or bus station for your departure.</p>
        
        <p>This itinerary offers a mix of cultural, historical, and recreational activities, giving you a taste of what Abuja has to offer. Remember, this is just a suggestion, and you can adjust it based on your interests and the time you have available.</p>
      `,
      author: {
        name: "Amina Ibrahim",
        image: "/placeholder.svg?height=100&width=100",
        bio: "Travel blogger and city guide with a passion for showcasing Nigeria's urban landscapes.",
      },
      date: "July 20, 2023",
      readTime: "12 min read",
      image: "/placeholder.svg?height=600&width=1200",
      category: "Travel",
      relatedPosts: [
        {
          title: "Top 10 Tourist Attractions in Lagos",
          slug: "top-10-tourist-attractions-in-lagos",
          image: "/placeholder.svg?height=300&width=400",
        },
        {
          title: "Best Nigerian Cuisines to Try in Lagos",
          slug: "best-nigerian-cuisines-to-try-in-lagos",
          image: "/placeholder.svg?height=300&width=400",
        },
        {
          title: "Exploring Nigeria's Cultural Festivals",
          slug: "exploring-nigerias-cultural-festivals",
          image: "/placeholder.svg?height=300&width=400",
        },
      ],
    },
    {
      slug: "lagos-nightlife-guide",
      title: "The Ultimate Guide to Lagos Nightlife",
      excerpt:
        "Navigate the vibrant nightlife scene in Lagos with our comprehensive guide to the best clubs, bars, and lounges.",
      content: `
        <p>Lagos comes alive after dark, transforming into a pulsating hub of entertainment and excitement. The city's nightlife scene is as diverse as its population, offering everything from upscale lounges to energetic nightclubs where you can dance until dawn.</p>
        
        <h2>The Hottest Nightclubs</h2>
        <p>Lagos boasts some of the most vibrant nightclubs in Africa, where local and international DJs spin the latest hits and Afrobeats classics.</p>
        <ul>
          <li><strong>Quilox:</strong> This multi-level club on Victoria Island is known for its state-of-the-art sound system and celebrity sightings.</li>
          <li><strong>Club 57:</strong> A favorite among Lagos's young professionals, Club 57 offers a mix of hip-hop, R&B, and Afrobeats in an upscale setting.</li>
          <li><strong>Escape:</strong> Located in the heart of Victoria Island, Escape is known for its themed nights and international guest DJs.</li>
        </ul>
        
        <h2>Sophisticated Lounges</h2>
        <p>For those who prefer a more relaxed atmosphere, Lagos offers numerous lounges where you can enjoy craft cocktails and good conversation.</p>
        <ul>
          <li><strong>Sip:</strong> This chic lounge serves creative cocktails in an elegant setting, making it perfect for after-work drinks or a night out with friends.</li>
          <li><strong>Crossroads:</strong> Known for its extensive wine list and live jazz performances, Crossroads provides a sophisticated nightlife experience.</li>
          <li><strong>R&R Luxury:</strong> This upscale lounge combines great drinks with stunning views of the Lagos lagoon.</li>
        </ul>
        
        <h2>Live Music Venues</h2>
        <p>Lagos has a thriving live music scene, with venues showcasing everything from traditional Nigerian music to contemporary jazz and Afrobeats.</p>
        <ul>
          <li><strong>Terra Kulture:</strong> This cultural center hosts regular performances by local musicians and theatrical productions.</li>
          <li><strong>Freedom Park:</strong> Once a colonial prison, Freedom Park is now a cultural and recreational center that features live music performances.</li>
          <li><strong>Niteshift Coliseum:</strong> This iconic venue has hosted some of Nigeria's biggest musical acts and continues to be a cornerstone of Lagos's live music scene.</li>
        </ul>
        
        <h2>Rooftop Bars</h2>
        <p>Take in the stunning views of Lagos while enjoying premium drinks at these rooftop establishments.</p>
        <ul>
          <li><strong>Sky Restaurant and Lounge:</strong> Located on the 27th floor of Eko Hotel, Sky offers panoramic views of the city and the Atlantic Ocean.</li>
          <li><strong>Brass and Copper:</strong> This rooftop bar combines great views with an extensive menu of craft cocktails.</li>
          <li><strong>Z Kitchen:</strong> Enjoy Mediterranean cuisine and creative drinks while taking in views of Ikoyi and Victoria Island.</li>
        </ul>
        
        <h2>Nightlife Safety Tips</h2>
        <p>While enjoying Lagos's vibrant nightlife, it's important to prioritize safety:</p>
        <ul>
          <li>Use trusted transportation services like Uber or Bolt.</li>
          <li>Keep valuables secure and avoid displaying expensive items.</li>
          <li>Stay aware of your surroundings, especially when leaving venues late at night.</li>
          <li>Consider using our concierge services for VIP access and secure transportation to and from nightlife venues.</li>
        </ul>
        
        <p>Lagos's nightlife offers something for everyone, from the energetic partygoer to those seeking a more relaxed evening experience. With this guide, you're ready to explore the best that the city has to offer after dark.</p>
      `,
      author: {
        name: "Ngozi Okafor",
        image: "/placeholder.svg?height=100&width=100",
        bio: "Lifestyle journalist and nightlife expert with over 8 years of experience covering Lagos entertainment scene.",
      },
      date: "April 28, 2023",
      readTime: "10 min read",
      image: "/placeholder.svg?height=600&width=1200",
      category: "Lifestyle",
      relatedPosts: [
        {
          title: "Top 10 Tourist Attractions in Lagos",
          slug: "top-10-tourist-attractions-in-lagos",
          image: "/placeholder.svg?height=300&width=400",
        },
        {
          title: "Best Nigerian Cuisines to Try in Lagos",
          slug: "best-nigerian-cuisines-to-try-in-lagos",
          image: "/placeholder.svg?height=300&width=400",
        },
        {
          title: "Luxury Shopping in Lagos",
          slug: "luxury-shopping-lagos",
          image: "/placeholder.svg?height=300&width=400",
        },
      ],
    },
    {
      slug: "luxury-shopping-lagos",
      title: "Luxury Shopping in Lagos: A Concierge's Perspective",
      excerpt: "Explore the luxury shopping scene in Lagos with insider tips from our experienced concierge team.",
      content: `
        <p>Lagos has emerged as a luxury shopping destination in Africa, with high-end boutiques, concept stores, and shopping centers catering to the discerning shopper. As concierge professionals, we've guided numerous clients through the city's luxury retail landscape, and we're excited to share our insider knowledge.</p>
        
        <h2>Luxury Fashion Destinations</h2>
        <p>Lagos boasts several destinations where fashion enthusiasts can find the latest collections from international and local designers.</p>
        
        <h3>Alara</h3>
        <p>Designed by renowned architect David Adjaye, Alara is more than just a store—it's a cultural and retail experience. This concept store showcases international luxury brands alongside the best of African design. The curated selection includes fashion, accessories, art, and design objects that reflect a contemporary African aesthetic.</p>
        
        <h3>Temple Muse</h3>
        <p>This luxury concept store offers a carefully selected range of fashion, accessories, and home décor. Temple Muse frequently hosts exhibitions and events, making it a cultural hub as well as a shopping destination. Their focus on promoting African designers alongside international brands makes it a unique stop on any luxury shopping itinerary.</p>
        
        <h3>Polo Avenue</h3>
        <p>For luxury accessories and leather goods, Polo Avenue is the premier destination in Lagos. The store carries an impressive selection of brands including Gucci, Bottega Veneta, Dolce & Gabbana, and Valentino. Their knowledgeable staff provides personalized service to help you find the perfect addition to your collection.</p>
        
        <h2>Jewelry and Watches</h2>
        <p>Lagos offers several options for those looking to invest in fine jewelry and timepieces.</p>
        
        <h3>Tiffany Amber Collective</h3>
        <p>Founded by Nigerian designer Folake Folarin-Coker, this store offers exquisite jewelry pieces that blend international luxury standards with African inspiration. The collections feature precious stones and metals crafted into unique designs that make for memorable keepsakes or gifts.</p>
        
        <h3>Cartier at Polo Luxury</h3>
        <p>Polo Luxury is the authorized retailer for several prestigious watch brands, including Cartier, Rolex, and Chopard. Their showroom provides an elegant setting to browse these timeless timepieces, with expert staff available to guide you through the collections.</p>
        
        <h2>Bespoke Services</h2>
        <p>Lagos has a growing scene of bespoke services for those seeking personalized luxury items.</p>
        
        <h3>Kemi Kudi</h3>
        <p>This atelier specializes in bespoke clothing for men and women, using the finest fabrics to create garments that perfectly fit both your body and lifestyle. Their attention to detail and craftsmanship rivals that of international luxury fashion houses.</p>
        
        <h3>Johnson's Shoes</h3>
        <p>For handcrafted leather shoes, Johnson's offers a bespoke service that allows you to design your perfect pair. From selecting the leather to choosing the style and details, every aspect of the process is customized to your preferences.</p>
        
        <h2>Concierge Shopping Services</h2>
        <p>As concierge professionals, we offer several services to enhance your luxury shopping experience in Lagos:</p>
        <ul>
          <li>Personal shopping appointments at exclusive boutiques</li>
          <li>After-hours private shopping experiences</li>
          <li>Styling consultations with top local fashion experts</li>
          <li>Secure transportation for your shopping excursions</li>
          <li>Shipping and customs assistance for international visitors</li>
        </ul>
        
        <p>Lagos's luxury retail scene continues to evolve, with new boutiques and concept stores opening regularly. Whether you're a visitor or a resident, exploring these luxury shopping destinations offers insight into the city's sophisticated taste and growing influence in the global luxury market.</p>
      `,
      author: {
        name: "Emeka Nwachukwu",
        image: "/placeholder.svg?height=100&width=100",
        bio: "Luxury retail specialist and personal shopper with extensive experience in high-end fashion.",
      },
      date: "March 15, 2023",
      readTime: "8 min read",
      image: "/placeholder.svg?height=600&width=1200",
      category: "Lifestyle",
      relatedPosts: [
        {
          title: "The Ultimate Guide to Lagos Nightlife",
          slug: "lagos-nightlife-guide",
          image: "/placeholder.svg?height=300&width=400",
        },
        {
          title: "Top 10 Tourist Attractions in Lagos",
          slug: "top-10-tourist-attractions-in-lagos",
          image: "/placeholder.svg?height=300&width=400",
        },
        {
          title: "Best Nigerian Cuisines to Try in Lagos",
          slug: "best-nigerian-cuisines-to-try-in-lagos",
          image: "/placeholder.svg?height=300&width=400",
        },
      ],
    },
  ]

  // Find the post with the matching slug
  const post = posts.find((post) => post.slug === slug)

  // Return the post or null if not found
  return post || null
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  // If post is not found, display a "not found" message
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The blog post you're looking for doesn't exist or may have been moved.
          </p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] bg-gray-900">
        <Image
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
          <div className="container mx-auto max-w-4xl">
            <Link href="/blog" className="flex items-center text-white mb-4 hover:text-primary transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center text-white/80 gap-4 md:gap-6">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share Section */}
            <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Share2 className="mr-2 h-5 w-5" />
                Share this article
              </h3>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Author Section */}
            <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-6">
              <div className="flex items-start space-x-4">
                <Image
                  src={post.author.image || "/placeholder.svg"}
                  alt={post.author.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold">{post.author.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{post.author.bio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Newsletter Signup */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Subscribe to our Newsletter</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Get the latest updates and offers directly to your inbox.
                </p>
                <div className="space-y-4">
                  <Input placeholder="Your email address" type="email" />
                  <Button className="w-full bg-primary hover:bg-primary/90">Subscribe</Button>
                </div>
              </CardContent>
            </Card>

            {/* Related Posts */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Related Posts</h3>
              <div className="space-y-4">
                {post.relatedPosts.map((relatedPost) => (
                  <Link href={`/blog/${relatedPost.slug}`} key={relatedPost.slug} className="block group">
                    <div className="flex space-x-4">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={relatedPost.image || "/placeholder.svg"}
                          alt={relatedPost.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium group-hover:text-primary transition-colors">{relatedPost.title}</h4>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
