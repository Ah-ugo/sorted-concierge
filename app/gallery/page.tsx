"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Instagram } from "lucide-react";
import { apiClient, type GalleryImage } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const instagramImages = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1541783249090-82af7b4c36b5",
    alt: "Detty December Celebration",
    caption: "Celebrating Detty December in Style",
    link: "https://www.instagram.com/sortedconcierge",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1629236727147-5a9c474c7147",
    alt: "Jet-Set Lifestyle",
    caption: "Jet-Set Living",
    link: "https://www.instagram.com/sortedconcierge",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
    alt: "Fashion Week Style",
    caption: "Stealing the Show at Fashion Week",
    link: "https://www.instagram.com/sortedconcierge",
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
    alt: "Private Dinner Setup",
    caption: "Crafting Unforgettable Evenings",
    link: "https://www.instagram.com/sortedconcierge",
  },
];

export default function Gallery() {
  const { toast } = useToast();
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
    caption: string;
  } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.7]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.05]);
  const heroTranslateY = useTransform(scrollY, [0, 300], [0, 50]);

  const [heroRef, heroInView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });
  const [galleryRef, galleryInView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });
  const [instaRef, instaInView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: false, threshold: 0.2 });

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const galleryData = await apiClient.getGallery({});
        setGalleryImages(galleryData);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load gallery images.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, [toast]);

  const openPreview = (
    image: { src: string; alt: string; caption: string },
    index: number
  ) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closePreview = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setSelectedImage({
      src: galleryImages[nextIndex].image_url,
      alt: galleryImages[nextIndex].title,
      caption:
        galleryImages[nextIndex].description || galleryImages[nextIndex].title,
    });
    setCurrentIndex(nextIndex);
  };

  const prevImage = () => {
    const prevIndex =
      (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage({
      src: galleryImages[prevIndex].image_url,
      alt: galleryImages[prevIndex].title,
      caption:
        galleryImages[prevIndex].description || galleryImages[prevIndex].title,
    });
    setCurrentIndex(prevIndex);
  };

  return (
    <>
      <section
        ref={heroRef}
        className="relative flex min-h-[60vh] items-center justify-center pt-10 overflow-hidden"
      >
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroTranslateY }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552"
            alt="Luxury Experiences Montage"
            fill
            priority
            className="w-full h-full object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
        </motion.div>
        <div className="container relative z-10 mx-auto my-16 md:my-32 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mx-auto max-w-3xl"
          >
            <p className="mb-4 font-normal text-sm sm:text-base md:text-lg italic tracking-wider text-secondary-light">
              EXPLORE OUR MOMENTS
            </p>
            <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl font-semibold uppercase tracking-widest text-white">
              OUR GALLERY
            </h1>
            <p className="mb-12 text-sm sm:text-base md:text-lg font-normal text-muted-foreground">
              Discover the luxury experiences we curate, from exclusive events
              to seamless travel.
            </p>
            <Button
              asChild
              className="bg-gold-gradient px-8 py-6 text-xs sm:text-sm font-normal uppercase tracking-widest text-black hover:bg-secondary-light/80"
            >
              <Link href="/membership-booking">Book an Experience</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="bg-black py-16 md:py-32" ref={galleryRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              galleryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-8 md:mb-16 text-2xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-widest text-white">
              Curated Moments
            </h2>
          </motion.div>
          {isLoading ? (
            <div className="text-center text-muted-foreground font-normal">
              Loading gallery...
            </div>
          ) : galleryImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    galleryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group cursor-pointer"
                  onClick={() =>
                    openPreview(
                      {
                        src: image.image_url,
                        alt: image.title,
                        caption: image.description || image.title,
                      },
                      index
                    )
                  }
                >
                  <div className="relative bg-card backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <Image
                      src={image.image_url}
                      alt={image.title}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-white font-normal text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {image.description || image.title}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground font-normal">
              No gallery images available.
            </div>
          )}
        </div>
      </section>

      <section className="bg-muted/20 py-16 md:py-32" ref={instaRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={instaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-8 md:mb-16 text-2xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-widest text-white">
              Follow Us on Instagram
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instagramImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  instaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="relative bg-card backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-white font-normal text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {image.caption}
                    <a
                      href={image.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2"
                    >
                      <Instagram className="w-5 h-5 text-secondary-light mx-auto" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={instaInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 text-center"
          >
            <Button
              asChild
              className="bg-gold-gradient px-8 py-6 text-xs sm:text-sm font-normal uppercase tracking-widest text-black hover:bg-secondary-light/80"
            >
              <a
                href="https://www.instagram.com/sortedconcierge"
                target="_blank"
                rel="noopener noreferrer"
              >
                View More on Instagram
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <section
        className="relative aspect-[21/9] w-full"
        style={{ minHeight: "300px" }}
        ref={ctaRef}
      >
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
            alt="Luxury Yacht at Sunset"
            fill
            className="w-full h-full object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="mb-8 text-2xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-widest text-white">
              Ready to Create Your Own Moments?
            </h2>
            <Button
              asChild
              className="bg-gold-gradient px-8 py-6 text-xs sm:text-sm font-normal uppercase tracking-widest text-black hover:bg-secondary-light/80"
            >
              <Link href="/membership-booking">Book Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 text-white hover:text-secondary-light"
            >
              <X className="w-8 h-8" />
            </button>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-secondary-light"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-secondary-light"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
            <div className="bg-card backdrop-blur-md rounded-xl overflow-hidden">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={800}
                height={600}
                className="w-full h-auto object-contain"
              />
              <div className="p-4 text-center text-white font-normal text-sm">
                {selectedImage.caption}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
