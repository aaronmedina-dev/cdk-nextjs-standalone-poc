import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
            data: `Dynamic SSR content for slug: ${context.query.slug || 'default'}`,
        },
    };
};

const SSRPage: React.FC<{ data: string }> = ({ data }) => {
    return (
        <div>
            <h1>Server-Side Rendered Dynamic Page</h1>
            <p>{data}</p>
        </div>
    );
};

export default SSRPage;
