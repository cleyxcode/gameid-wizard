import React, { useState } from 'react';
import { Gamepad2, Search, Shield, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import gamingHero from '@/assets/gaming-hero.jpg';

interface GameIdResult {
  status: boolean;
  data?: {
    username: string;
  };
  error?: string;
}

const GAMES = [
  { value: 'freefire', label: 'Free Fire', icon: '🔥' },
  { value: 'ml', label: 'Mobile Legends', icon: '⚔️' },
  { value: 'codm', label: 'Call of Duty Mobile', icon: '🎯' },
  { value: 'aov', label: 'Arena of Valor', icon: '🏛️' },
  { value: 'genshin', label: 'Genshin Impact', icon: '🌟' },
];

const SERVERS = [
  { value: 'Asia', label: 'Asia' },
  { value: 'America', label: 'America' },
  { value: 'Europe', label: 'Europe' },
];

const GameIdChecker: React.FC = () => {
  const [game, setGame] = useState<string>('');
  const [gameId, setGameId] = useState<string>('');
  const [zoneId, setZoneId] = useState<string>('');
  const [server, setServer] = useState<string>('Asia');
  const [result, setResult] = useState<GameIdResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const API_URL = "https://api.velixs.com/idgames-checker";
  const API_KEY = "048f3a3b076ac497a0af926bdbbf685d4a424c6dc0eb2b71c9";

  const handleCheckId = async () => {
    if (!game || !gameId) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon pilih game dan masukkan ID",
        variant: "destructive",
      });
      return;
    }

    if (game === 'ml' && !zoneId) {
      toast({
        title: "Zone ID diperlukan",
        description: "Mohon masukkan Zone ID untuk Mobile Legends",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    let payload: any = {
      game: game,
      id: gameId,
    };

    if (game === 'ml') payload.zoneid = zoneId;
    if (game === 'genshin') payload.server = server;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-VelixsAPI-Key': API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setResult(data);

      if (data.status) {
        toast({
          title: "ID ditemukan!",
          description: `Username: ${data.data.username}`,
        });
      } else {
        toast({
          title: "ID tidak ditemukan",
          description: data.error || "Gagal memeriksa ID",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan';
      setResult({ status: false, error: errorMessage });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedGame = GAMES.find(g => g.value === game);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Hero Section */}
      <div 
        className="relative h-48 md:h-64 lg:h-80 rounded-3xl overflow-hidden mb-8 flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${gamingHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center text-white z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-8 h-8 md:w-12 md:h-12 text-primary-glow" />
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
              Game ID Checker
            </h1>
          </div>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto px-4">
            Verifikasi akun gaming Anda dengan mudah dan cepat
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="gaming-card fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Shield className="w-6 h-6 text-primary" />
                  Cek ID Game
                </CardTitle>
                <CardDescription className="text-base">
                  Pilih game dan masukkan ID untuk memverifikasi akun Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Game Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Pilih Game *
                  </label>
                  <Select value={game} onValueChange={setGame}>
                    <SelectTrigger className="gaming-select h-12">
                      <SelectValue placeholder="Pilih game yang ingin dicek">
                        {selectedGame && (
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{selectedGame.icon}</span>
                            <span>{selectedGame.label}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {GAMES.map((gameOption) => (
                        <SelectItem key={gameOption.value} value={gameOption.value}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{gameOption.icon}</span>
                            <span>{gameOption.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Game ID Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Game ID *
                  </label>
                  <Input
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    placeholder="Masukkan ID game Anda"
                    className="gaming-input h-12 text-base"
                  />
                </div>

                {/* Zone ID for Mobile Legends */}
                {game === 'ml' && (
                  <div className="space-y-2 slide-in">
                    <label className="text-sm font-medium text-foreground">
                      Zone ID *
                    </label>
                    <Input
                      value={zoneId}
                      onChange={(e) => setZoneId(e.target.value)}
                      placeholder="Masukkan Zone ID untuk Mobile Legends"
                      className="gaming-input h-12 text-base"
                    />
                  </div>
                )}

                {/* Server Selection for Genshin Impact */}
                {game === 'genshin' && (
                  <div className="space-y-2 slide-in">
                    <label className="text-sm font-medium text-foreground">
                      Server *
                    </label>
                    <Select value={server} onValueChange={setServer}>
                      <SelectTrigger className="gaming-select h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVERS.map((serverOption) => (
                          <SelectItem key={serverOption.value} value={serverOption.value}>
                            {serverOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={handleCheckId}
                  disabled={isLoading || !game || !gameId}
                  className="gaming-button w-full h-12 text-lg font-semibold text-primary-foreground rounded-xl"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Cek ID Sekarang
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Result Card */}
            {result && (
              <Card className="gaming-card fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {result.status ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                    Hasil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.status ? (
                    <div className="space-y-3">
                      <Badge variant="secondary" className="bg-success text-success-foreground">
                        ID Valid
                      </Badge>
                      <div>
                        <p className="text-sm text-muted-foreground">Username:</p>
                        <p className="font-semibold text-lg text-foreground">
                          {result.data?.username}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Badge variant="destructive">
                        ID Tidak Valid
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {result.error || 'Gagal memeriksa ID'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Info Card */}
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-lg">Tips Penggunaan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Mobile Legends:</strong> Memerlukan Game ID dan Zone ID
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Genshin Impact:</strong> Pilih server yang sesuai
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div>
                    Game lain hanya memerlukan Game ID
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameIdChecker;