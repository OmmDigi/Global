import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";

async function getPost(slug) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BLOG}/wp-json/custom/v1/blog/${slug}`,
    {
      next: { revalidate: 60 }, // ISR caching (optional)
    }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function PostDetails({ params }) {
  const post = await getPost(params?.slug);
  const category = post?.categories?.map((cat) => cat.name).join(", ");
  
  console.log("resssss", post);
  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <div className="relative bg-gray-300 overflow-hidden top-0 z-0">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: "url('/image/instit.jpg')" }} // replace with your image path
        ></div>
        <div className="flex justify-center text-center text-[#023b81] align-middle items-center  h-30">
          <h1 className="text-5xl font-bold">Our Blog</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <article className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex flex-col justify-center items-center gap-2 mb-4">
            <div className=" flex justify-center items-center">
              <p
                dangerouslySetInnerHTML={{
                  __html: category,
                }}
                className="text-sm p-1 bg-blue-500 text-gray-100"
              ></p>
            </div>
            <h1 className="text-3xl flex items-center font-bold mb-4">
              {post?.title}
            </h1>
          </div>
          <figure className="relative">
            <Image
              src={post?.thumbnail}
              alt={post?.thumbnail_alt || "Post image"}
              width={1280}
              height={720}
              className="w-full h-auto object-cover"
            />
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
              <span>{post?.date}</span>
            </div>
          </figure>

          <div className="p-6">
            {/* <p className="text-sm text-gray-500 mb-2">{post?.date}</p> */}

            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post?.content }}
            />
          </div>
        </article>
      </div>
      
      <Footer />
      <BackToTopButton />
    </>
  );
}
