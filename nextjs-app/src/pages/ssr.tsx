import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        props: { message: 'Hello from SSR with TypeScript!' },
    };
};

interface SSRPageProps {
    message: string;
}

const SSRPage: React.FC<SSRPageProps> = ({ message }) => {
    return (
        <div>
            <h1>Server-Side Rendering</h1>
            <p>{message}</p>
        </div>
    );
};

export default SSRPage;
