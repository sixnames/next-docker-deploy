'use server';
import { getConfigsCollection } from '@/actions/mongo';

export default async function Page() {
  const configsCollection = await getConfigsCollection();
  await configsCollection.insertOne({ name: 'test' });
  const configs = await configsCollection.find().toArray();
  console.log(configs);

  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}