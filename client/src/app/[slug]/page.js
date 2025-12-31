import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import "@/app/blog_content.css";
import Link from "next/link";

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

  if (!post) {
    notFound();
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BLOG}wp-json/custom/v1/blog/${params?.slug}/related`
  );
  const response = await res.json();

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

      <div className="max-w-6xl mx-auto p-6 gap-20 flex">
        <article className="bg-white shadow-md rounded-lg overflow-hidden w-[70%]">
          <div className="flex flex-col justify-center items-center gap-2 mb-4">
            <div className=" flex justify-center items-center">
              <p
                dangerouslySetInnerHTML={{
                  __html: category,
                }}
                className="text-sm p-1 bg-blue-500 text-gray-100"
              ></p>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: post?.title }}
              className="text-3xl flex items-center font-bold mb-4"
            ></div>
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
            <div
              className="blog_content"
              dangerouslySetInnerHTML={{ __html: post?.content }}
            />
          </div>
        </article>
        <div className="w-[30%] text-2xl font-bold">
          <h2 >Related Blogs</h2>
          <hr className="text-2xl font-bold mb-3" />
          <div className="grid grid-cols-1  items-center">
            {response?.map((data, index) => {
              const category = data?.categories
                ?.map((cat) => cat.name)
                .join(", ");
              return (
                <article
                  key={index}
                  className="w-full h-160 p-4 mb-5 shadow-2xl bg-white"
                >
                  <Link
                    href={`${data?.slug}`}
                    className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden"
                  >
                    <figure className="relative">
                      <Link href={`${data?.slug}`}>
                        <Image
                          height={1280}
                          width={1280}
                          src={data?.thumbnail}
                          alt={data?.thumbnail_alt}
                          className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </Link>
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                        <span>{data?.date}</span>
                      </div>
                    </figure>
                    <div className="p-4  text-center">
                      <div className=" flex justify-center">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: category,
                          }}
                          className="text-sm p-1 bg-blue-500 text-gray-100"
                        ></p>
                      </div>
                      <h3
                        dangerouslySetInnerHTML={{ __html: data?.title }}
                        className="text-lg font-semibold text-gray-800 hover:text-blue-600"
                      >
                        {/* <Link href={`${data?.slug}`}>{data?.title}</Link> */}
                      </h3>

                      {/* <div className="flex items-center text-sm text-gray-500 mt-2">
              <span>By admin</span>
            </div> */}
                      <p
                        dangerouslySetInnerHTML={{ __html: data?.short_desc }}
                        className="text-sm text-gray-600 mt-3"
                      ></p>
                      <div className="mt-4">
                        <Link
                          href={`${data?.slug}`}
                          className="text-blue-600 hover:underline font-semibold text-sm"
                        >
                          Continue reading
                        </Link>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
      <BackToTopButton />
    </>
  );
}
