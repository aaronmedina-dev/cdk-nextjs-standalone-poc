import { GetStaticProps, GetStaticPaths } from 'next';
interface BlogPostProps {
    post: { 
        id: string;
        title: string; 
        content: string; 
    };
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
        fallback: 'blocking', // ISR for non-pre-rendered pages
    };
};

export const getStaticProps: GetStaticProps = async (context) => {
    const id = context.params?.id;

    try {
        if (!id || typeof id !== 'string') {
            return { notFound: true };
        }

        const response = await fetch('https://d34zwmtiebwwbl.cloudfront.net/data/posts.json');

        if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
            throw new Error(`Invalid response from posts.json: ${response.status}`);
        }

        const posts = await response.json();

        if (!Array.isArray(posts)) {
            throw new Error('Invalid posts data format');
        }

        const post = posts.find((p: { id: string }) => p.id === id);

        if (!post) {
            return { notFound: true };
        }

        const sanitizedPost = JSON.parse(JSON.stringify(post));
        if (!sanitizedPost || typeof sanitizedPost.title !== 'string' || typeof sanitizedPost.content !== 'string') {
            throw new Error('Invalid post data');
        }

        console.log('Final props:', sanitizedPost);
        return {
            props: { post: sanitizedPost },
            revalidate: 60,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error in getStaticProps:', error.message);
        } else {
            console.error('Unknown error in getStaticProps:', error);
        }
        return { notFound: true };
    }
};



// create blogpost react post: { title: string; content: string }

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
    if (!post) {
        return <div>Error: Post data is missing</div>;
    }
    return (
        <div>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
        </div>
    );
};

export default BlogPost;






