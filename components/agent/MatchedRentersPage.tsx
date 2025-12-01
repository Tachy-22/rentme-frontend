'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, MessageCircle, Phone, Mail, MapPin, GraduationCap, DollarSign, Home, Shield, AlertCircle } from 'lucide-react';
import { getMatchedRenters } from '@/actions/agents/getMatchedRenters';
import { createConversation } from '@/actions/messages/createConversation';
import { useRouter } from 'next/navigation';

interface MatchedRenter {
  id: string;
  name: string;
  email: string;
  university: string;
  budget: {
    min: number;
    max: number;
  };
  preferredLocation: string;
  accommodationType: string[];
  verificationStatus: string;
  profilePicture?: string;
  matchScore: number;
  lastActive: string;
  contact?: {
    phone?: string;
    email: string;
  };
}

export default function MatchedRentersPage() {
  const [renters, setRenters] = useState<MatchedRenter[]>([]);
  const [filteredRenters, setFilteredRenters] = useState<MatchedRenter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerificationRequired, setIsVerificationRequired] = useState(false);
  const [contactingRenter, setContactingRenter] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadMatchedRenters();
  }, []);

  useEffect(() => {
    const filtered = renters.filter(renter =>
      renter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      renter.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      renter.preferredLocation.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRenters(filtered);
  }, [searchTerm, renters]);

  const loadMatchedRenters = async () => {
    try {
      setLoading(true);
      const result = await getMatchedRenters();

      if (!result.success) {
        if (result.error === 'VERIFICATION_REQUIRED') {
          setIsVerificationRequired(true);
          setError(result.message || 'Verification required to access matched renters');
        } else {
          setError(result.error || 'Failed to load matched renters');
        }
        return;
      }

      setRenters(result.data || []);
      setError(null);
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleContactRenter = async (renterId: string) => {
    try {
      setContactingRenter(renterId);
      const result = await createConversation({ participantId: renterId });

      if (result.success && result.conversationId) {
        router.push(`/agent/messages?conversation=${result.conversationId}`);
      } else {
        setError('Failed to start conversation');
      }
    } catch (err) {
      setError('Failed to contact renter');
    } finally {
      setContactingRenter(null);
    }
  };

  const formatBudget = (budget: { min: number; max: number }) => {
    if (budget.min === 0 && budget.max === 0) return 'Not specified';
    if (budget.min === 0) return `Up to $${budget.max.toLocaleString()}`;
    if (budget.max === 0) return `From $${budget.min.toLocaleString()}`;
    return `$${budget.min.toLocaleString()} - $${budget.max.toLocaleString()}`;
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  const formatLastActive = (lastActive: string) => {
    const date = new Date(lastActive);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-0 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading matched renters...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isVerificationRequired) {
    return (
      <div className="min-h-screen bg-background p-0 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Alert className="border-amber-200 bg-amber-50">
            <Shield className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <div className="space-y-4">
                <p className="font-medium">Verification Required</p>
                <p>To access matched renters and connect with verified students, you need to complete your agent verification process.</p>
                <Button
                  onClick={() => router.push('/agent/verification')}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Get Verified Now
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-0 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Matched Renters</h1>
            <p className="text-muted-foreground">
              Connect with verified student renters who match your properties
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-green-600" />
            <span>Showing verified renters only</span>
          </div>
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, university, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={loadMatchedRenters}>
            Refresh Matches
          </Button>
        </div>

        {filteredRenters.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">No matched renters found</h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? 'Try adjusting your search criteria'
                    : 'Check back later for new matches or add more properties to improve matching'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredRenters.map((renter) => (
              <Card key={renter.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={renter.profilePicture} />
                        <AvatarFallback>
                          {renter.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{renter.name}</h3>
                          <Badge className={getMatchScoreColor(renter.matchScore)}>
                            {renter.matchScore}% match
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <GraduationCap className="h-4 w-4" />
                          <span>{renter.university}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Last active: {formatLastActive(renter.lastActive)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Budget:</span>
                          <span>{formatBudget(renter.budget)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Location:</span>
                          <span>{renter.preferredLocation}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <Home className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <span className="font-medium">Accommodation:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {renter.accommodationType.length > 0 ? (
                                renter.accommodationType.map((type, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {type}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-muted-foreground">Any</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => handleContactRenter(renter.id)}
                          disabled={contactingRenter === renter.id}
                          className="w-full"
                        >
                          {contactingRenter === renter.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Connecting...
                            </>
                          ) : (
                            <>
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Start Conversation
                            </>
                          )}
                        </Button>
                        <div className="flex gap-2">
                          {renter.contact?.phone && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`tel:${renter.contact?.phone}`)}
                              className="flex-1"
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`mailto:${renter.email}`)}
                            className="flex-1"
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredRenters.length > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Showing {filteredRenters.length} of {renters.length} matched renters
          </div>
        )}
      </div>
    </div>
  );
}