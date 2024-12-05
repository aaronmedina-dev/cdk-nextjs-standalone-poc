import { GetServerSideProps } from 'next';

interface DynamicPageProps {
    slug: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params as { slug: string };
    return {
        props: { slug },
    };
};

const DynamicPage: React.FC<DynamicPageProps> = ({ slug }) => {
    return (
        <div>
            <h1>Dynamic Routing</h1>
            <p>You visited the dynamic route: {slug}</p>
        </div>
    );
};

export default DynamicPage;
