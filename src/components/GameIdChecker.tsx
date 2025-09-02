import React, { useState } from 'react';
import { Gamepad2, Search, Shield, CheckCircle, XCircle, Loader2, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen p-4 md:p-6 lg:p-8"
    >
      {/* Hero Section */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative h-48 md:h-64 lg:h-80 rounded-3xl overflow-hidden mb-8 flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${gamingHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary-glow/20"></div>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center text-white z-10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <Gamepad2 className="w-8 h-8 md:w-12 md:h-12 text-primary-glow drop-shadow-lg" />
            </motion.div>
            <motion.h1 
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-primary-glow to-white bg-clip-text text-transparent"
            >
              Game ID Checker
            </motion.h1>
          </div>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto px-4"
          >
            Verifikasi akun gaming Anda dengan mudah dan cepat
          </motion.p>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-4 right-4"
          >
            <Sparkles className="w-6 h-6 text-primary-glow" />
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="lg:col-span-2"
          >
            <motion.div
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.25)" }}
              transition={{ duration: 0.3 }}
            >
              <Card className="gaming-card backdrop-blur-sm bg-card/80 border-2 border-border/50">
                <CardHeader>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Shield className="w-6 h-6 text-primary" />
                      </motion.div>
                      Cek ID Game
                    </CardTitle>
                    <CardDescription className="text-base">
                      Pilih game dan masukkan ID untuk memverifikasi akun Anda
                    </CardDescription>
                  </motion.div>
                </CardHeader>
              <CardContent className="space-y-6">
                {/* Game Selection */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    Pilih Game *
                  </label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Select value={game} onValueChange={setGame}>
                      <SelectTrigger className="gaming-select h-12 border-2 hover:border-primary/50 transition-all duration-300">
                        <SelectValue placeholder="Pilih game yang ingin dicek">
                          {selectedGame && (
                            <motion.div 
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              className="flex items-center gap-2"
                            >
                              <motion.span 
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 1 }}
                                className="text-xl"
                              >
                                {selectedGame.icon}
                              </motion.span>
                              <span>{selectedGame.label}</span>
                            </motion.div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {GAMES.map((gameOption, index) => (
                          <motion.div
                            key={gameOption.value}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <SelectItem value={gameOption.value}>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{gameOption.icon}</span>
                                <span>{gameOption.label}</span>
                              </div>
                            </SelectItem>
                          </motion.div>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                </motion.div>

                {/* Game ID Input */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-foreground">
                    Game ID *
                  </label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      value={gameId}
                      onChange={(e) => setGameId(e.target.value)}
                      placeholder="Masukkan ID game Anda"
                      className="gaming-input h-12 text-base border-2 hover:border-primary/50 transition-all duration-300"
                    />
                  </motion.div>
                </motion.div>

                {/* Zone ID for Mobile Legends */}
                <AnimatePresence>
                  {game === 'ml' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0, y: -20 }}
                      animate={{ height: "auto", opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="space-y-2 overflow-hidden"
                    >
                      <label className="text-sm font-medium text-foreground">
                        Zone ID *
                      </label>
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Input
                          value={zoneId}
                          onChange={(e) => setZoneId(e.target.value)}
                          placeholder="Masukkan Zone ID untuk Mobile Legends"
                          className="gaming-input h-12 text-base border-2 hover:border-primary/50 transition-all duration-300"
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Server Selection for Genshin Impact */}
                <AnimatePresence>
                  {game === 'genshin' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0, y: -20 }}
                      animate={{ height: "auto", opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="space-y-2 overflow-hidden"
                    >
                      <label className="text-sm font-medium text-foreground">
                        Server *
                      </label>
                      <Select value={server} onValueChange={setServer}>
                        <SelectTrigger className="gaming-select h-12 border-2 hover:border-primary/50 transition-all duration-300">
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
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -12px rgba(139, 92, 246, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      onClick={handleCheckId}
                      disabled={isLoading || !game || !gameId}
                      className="gaming-button w-full h-12 text-lg font-semibold text-primary-foreground rounded-xl relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary-glow/20 to-transparent"
                        animate={{ x: [-100, 300] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      />
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center"
                          >
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Memproses...
                          </motion.div>
                        ) : (
                          <motion.div
                            key="search"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center"
                          >
                            <Search className="w-5 h-5 mr-2" />
                            Cek ID Sekarang
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </motion.div>
              </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-6"
          >
            {/* Result Card */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <motion.div
                    whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.25)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="gaming-card backdrop-blur-sm bg-card/80 border-2 border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <motion.div
                            animate={{ 
                              scale: result.status ? [1, 1.2, 1] : [1, 0.8, 1],
                              rotate: result.status ? [0, 360] : [0, -10, 10, 0]
                            }}
                            transition={{ duration: 0.6 }}
                          >
                            {result.status ? (
                              <CheckCircle className="w-5 h-5 text-success" />
                            ) : (
                              <XCircle className="w-5 h-5 text-destructive" />
                            )}
                          </motion.div>
                          Hasil
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {result.status ? (
                          <motion.div 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-3"
                          >
                            <motion.div
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 1 }}
                            >
                              <Badge variant="secondary" className="bg-success text-success-foreground">
                                ID Valid
                              </Badge>
                            </motion.div>
                            <div>
                              <p className="text-sm text-muted-foreground">Username:</p>
                              <motion.p 
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="font-semibold text-lg text-foreground"
                              >
                                {result.data?.username}
                              </motion.p>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-3"
                          >
                            <motion.div
                              animate={{ x: [0, -2, 2, 0] }}
                              transition={{ duration: 0.5 }}
                            >
                              <Badge variant="destructive">
                                ID Tidak Valid
                              </Badge>
                            </motion.div>
                            <p className="text-sm text-muted-foreground">
                              {result.error || 'Gagal memeriksa ID'}
                            </p>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info Card */}
            <motion.div
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.25)" }}
              transition={{ duration: 0.3 }}
            >
              <Card className="gaming-card backdrop-blur-sm bg-card/80 border-2 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-5 h-5 text-primary" />
                    </motion.div>
                    Tips Penggunaan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  {[
                    { text: "Mobile Legends:", desc: "Memerlukan Game ID dan Zone ID" },
                    { text: "Genshin Impact:", desc: "Pilih server yang sesuai" },
                    { text: "Game lain hanya memerlukan Game ID", desc: "" }
                  ].map((tip, index) => (
                    <motion.div 
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                        className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"
                      ></motion.div>
                      <div>
                        <strong>{tip.text}</strong> {tip.desc}
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameIdChecker;