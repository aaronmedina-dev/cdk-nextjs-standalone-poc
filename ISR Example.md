
Create page for ISR Example:

```bash
mkdir -p nexjs-app/src/pages/blog && touch nexjs-app/src/pages/blog/[id].tsx
```

Update the code of `[id].tsx`

```tsx
import { GetStaticProps, GetStaticPaths } from 'next';

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
    fallback: 'blocking', // ISR for non-pre-rendered pages
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id;
  const data = await fetchDataFromAPI(id); // Replace with actual API call

  return {
    props: { data },
    revalidate: 60, // Revalidate cache every 60 seconds
  };
};

const BlogPost = ({ data }: { data: any }) => {
  return <div>{JSON.stringify(data)}</div>;
};

export default BlogPost;
```

Use `getStaticProps` with `revalidate` property in pages you want to enable ISR for.