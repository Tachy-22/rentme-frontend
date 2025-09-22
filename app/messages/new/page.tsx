import { getUserById, getPropertyById, getStudents } from '../../../data';
import { Header } from '../../../components/Header';
import { NewMessageForm } from '../../../components/NewMessageForm';
import { SimpleBackButton } from '../../../components/SimpleBackButton';
import { notFound } from 'next/navigation';
import { Property } from '@/types';

interface NewMessagePageProps {
  searchParams: {
    agentId?: string;
    propertyId?: string;
  };
}

export default function NewMessagePage({ searchParams }: NewMessagePageProps) {
  const currentUser = getStudents()[3];
  const { agentId, propertyId } = searchParams;

  if (!agentId) {
    notFound();
  }

  const agent = getUserById(agentId);
  const property = propertyId ? getPropertyById(propertyId) : null;

  if (!agent) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Header user={currentUser} />

      <main className="pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-4 flex items-center">
            <SimpleBackButton />
            <h1 className="text-lg font-semibold text-gray-900">New Message</h1>
          </div>
        </div>

        <NewMessageForm
          agent={agent}
          property={property as Property}
          currentUser={currentUser}
        />
      </main>
    </div>
  );
}