import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import MoreStories from '../../components/more-stories'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import SectionSeparator from '../../components/section-separator'
import Layout from '../../components/layout'
import PostTitle from '../../components/post-title'
import Tags from '../../components/tags'
import { getAllPostsWithSlug, getPostAndMorePosts } from '../../lib/api'
import { CMS_NAME } from '../../lib/constants'

const domain = process.env.NEXT_PUBLIC_WORDPRESS_API_URL.replace('graphql', '');

export default function Post({ post, preview, host }) {
  const router = useRouter();

  const isRedirect = (typeof window !== "undefined" && (window.location.search || (typeof document !== "undefined" && document.referrer.indexOf("facebook.com") !== -1)) && post.slug) ? true : false;

  if (isRedirect) {
    window.location.href = `${domain}${post.slug}`;
  }

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <meta
                  property="og:url"
                  content={`${host}/_next/image?url=${encodeURIComponent(
                    post.featuredImage?.node.sourceUrl
                  )}&w=3840&q=100`}
                />
              </Head>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
                {post.title}
              </h1>
              <p>You are being redirected to the post, please wait 1-2 seconds...</p>
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { slug } = context.params;
//   if (context.req.headers.referer && context.res) {
//     if (context.req.headers.referer.indexOf("facebook.com") !== -1) {
//     context.res.setHeader("location", `${domain}${slug}`);
//     context.res.statusCode = 301;
//     context.res.end();
//       return { props: {
//         preview: false,
//         post: {},
//         host: ""
//       } };
//     }
//   }
  const data = await getPostAndMorePosts(slug, false, {})

  return {
    props: {
      preview: false,
      post: data.post,
      host: `https://${context.req.headers.host}`,
    }
  }
}
