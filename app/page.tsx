'use server';
import { getConfigsCollection } from '@/actions/mongo';

interface PageProps {
}

export default async function Page({}: PageProps) {
  const configsCollection = await getConfigsCollection();
  const configs = await configsCollection.find().toArray();
  console.log(configs);

  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}