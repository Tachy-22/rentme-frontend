import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDocument } from '@/actions/firebase';
import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import ApplicationFormClient from '@/components/applications/ApplicationFormClient';
import { Property } from '@/types';

interface ApplyPageProps {
  params: {
    propertyId: string;
  };
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user-id')?.value;
  const userRole = cookieStore.get('user-role')?.value;

  if (!userId) {
    redirect('/auth/login?redirect=/apply/' + params.propertyId);
  }

  if (userRole !== 'renter') {
    redirect('/dashboard?error=unauthorized');
  }

  const userResult = await getCurrentUser();
  if (!userResult.success || !userResult.user) {
    redirect('/auth/login?redirect=/apply/' + params.propertyId);
  }

  const propertyResult = await getDocument({
    collectionName: 'properties',
    documentId: params.propertyId
  });
  if (!propertyResult.success || !propertyResult.data) {
    redirect('/properties?error=property-not-found');
  }

  const property = propertyResult.data as unknown as Property;

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Apply for Property</h1>
            <p className="text-muted-foreground mt-2">
              Complete the application form for {property?.title || 'this property'}
            </p>
          </div>

          <ApplicationFormClient 
            user={userResult.user}
            property={property}
          />
        </div>
      </div>
    </div>
  );
}