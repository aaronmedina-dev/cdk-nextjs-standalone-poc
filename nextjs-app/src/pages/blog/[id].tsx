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
    console.log('Requested ID:', id);

    try {
        const response = await fetch('https://d34zwmtiebwwbl.cloudfront.net/data/posts.json');

        if (!response.ok) {
            console.error('Invalid response from posts.json:', response.status);
            throw new Error('Failed to fetch posts.json');
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('Invalid content type:', contentType);
            throw new Error('Invalid content type from posts.json');
        }

        const posts = await response.json();
        console.log('Fetched posts:', posts);

        const post = posts.find((p: { id: string }) => p.id === id);
        console.log('Found post:', post);

        if (!post) {
            console.warn('Post not found, returning 404');
            return { notFound: true };
        }

        // Ensure post is serializable
        const sanitizedPost = JSON.parse(JSON.stringify(post));

        console.log('Serialized post:', sanitizedPost);
        return {
            props: { post: sanitizedPost },
            revalidate: 60, // Revalidate every 60 seconds
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






