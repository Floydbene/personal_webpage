import { createClient } from 'contentful';
import { useState, useEffect } from 'react';

export const useFetchProjects = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  const getData = async () => {
    try {
      const response = await client.getEntries({
        content_type: 'websiteShowcase',
      });
      setLoading(false);
      // console.log(response);

      const projects = response.items.map((item) => {
        const id = item.sys.id;
        const { title, url } = item.fields;
        const img = item.fields.screenshot?.fields?.file?.url;
        return { title, url, img, id };
      });
      setProjects(projects);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return { loading, projects };
};

const client = createClient({
  space: '72yvm3f2a311',
  // environment: 'master',
  accessToken: import.meta.env.VITE_API_KEY,
});
