import { GetStaticProps, GetStaticPaths } from 'next';

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
        fallback: 'blocking', // ISR for non-pre-rendered pages
    };
};

export const getStaticProps: GetStaticProps = async (context) => {
    const id = context.params?.id;
    console.log('Requested ID:', id);

    try {
        const response = await fetch('https://d34zwmtiebwwbl.cloudfront.net/data/posts.json');
        if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
            console.error('Invalid response from posts.json:', response.status);
            throw new Error('Invalid response from posts.json');
        }

        const posts = await response.json();
        console.log('Fetched posts:', posts);

        const post = posts.find((p: { id: string }) => p.id === id);
        console.log('Found post:', post);

        if (!post) {
            return { notFound: true };
        }

        console.log('Serialized post:', JSON.stringify(post)); 

        return {
            props: { post },
            revalidate: 60,
        };
    } catch (error) {
        console.error('Error in getStaticProps:', error);
        return { notFound: true };
    }
};

const BlogPost = ({ post }: { post: { title: string; content: string } }) => {
    console.log('Rendered post:', post); 

    // Debug: log HTML content
    const htmlContent = `<div><h1>${post.title}</h1><p>${post.content}</p></div>`;
    console.log('Generated HTML:', htmlContent);

    return (
        <>
            <div>
                <h1>{post.title}</h1>
                <p>{post.content}</p>
            </div>
        </>
    );
};

export default BlogPost;




