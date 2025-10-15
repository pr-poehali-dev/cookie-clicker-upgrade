import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  multiplier: number;
  icon: string;
  owned: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: number;
  unlocked: boolean;
  icon: string;
}

const Index = () => {
  const [cookies, setCookies] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [clickAnimation, setClickAnimation] = useState(false);
  const [floatingNumbers, setFloatingNumbers] = useState<Array<{ id: number; value: number; x: number; y: number }>>([]);
  const { toast } = useToast();

  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: 'cursor',
      name: '👆 Курсор',
      description: 'Улучшает силу клика',
      cost: 10,
      multiplier: 1,
      icon: 'MousePointer2',
      owned: 0
    },
    {
      id: 'hand',
      name: '✋ Рука',
      description: '+2 к клику',
      cost: 50,
      multiplier: 2,
      icon: 'Hand',
      owned: 0
    },
    {
      id: 'robot',
      name: '🤖 Робот',
      description: '+5 к клику',
      cost: 200,
      multiplier: 5,
      icon: 'Bot',
      owned: 0
    },
    {
      id: 'factory',
      name: '🏭 Фабрика',
      description: '+10 к клику',
      cost: 500,
      multiplier: 10,
      icon: 'Factory',
      owned: 0
    },
    {
      id: 'rocket',
      name: '🚀 Ракета',
      description: '+25 к клику',
      cost: 1500,
      multiplier: 25,
      icon: 'Rocket',
      owned: 0
    },
    {
      id: 'galaxy',
      name: '🌌 Галактика',
      description: '+100 к клику',
      cost: 10000,
      multiplier: 100,
      icon: 'Sparkles',
      owned: 0
    }
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'first', name: 'Первый клик', description: 'Кликните первый раз', requirement: 1, unlocked: false, icon: 'Star' },
    { id: 'hundred', name: 'Сотня', description: 'Соберите 100 печенек', requirement: 100, unlocked: false, icon: 'Trophy' },
    { id: 'thousand', name: 'Тысяча', description: 'Соберите 1000 печенек', requirement: 1000, unlocked: false, icon: 'Award' },
    { id: 'master', name: 'Мастер кликов', description: 'Купите 5 улучшений', requirement: 5, unlocked: false, icon: 'Crown' }
  ]);

  useEffect(() => {
    const checkAchievements = () => {
      const totalUpgrades = upgrades.reduce((sum, u) => sum + u.owned, 0);
      
      setAchievements(prev => prev.map(ach => {
        if (ach.unlocked) return ach;
        
        let shouldUnlock = false;
        if (ach.id === 'first' && cookies >= ach.requirement) shouldUnlock = true;
        if (ach.id === 'hundred' && cookies >= ach.requirement) shouldUnlock = true;
        if (ach.id === 'thousand' && cookies >= ach.requirement) shouldUnlock = true;
        if (ach.id === 'master' && totalUpgrades >= ach.requirement) shouldUnlock = true;
        
        if (shouldUnlock) {
          toast({
            title: '🎉 Достижение разблокировано!',
            description: ach.name,
            duration: 3000
          });
        }
        
        return { ...ach, unlocked: shouldUnlock || ach.unlocked };
      }));
    };
    
    checkAchievements();
  }, [cookies, upgrades, toast]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCookies(prev => prev + clickPower);
    setClickAnimation(true);
    setTimeout(() => setClickAnimation(false), 200);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newFloat = {
      id: Date.now(),
      value: clickPower,
      x,
      y
    };
    
    setFloatingNumbers(prev => [...prev, newFloat]);
    setTimeout(() => {
      setFloatingNumbers(prev => prev.filter(f => f.id !== newFloat.id));
    }, 1000);
  };

  const buyUpgrade = (upgrade: Upgrade) => {
    const currentCost = Math.floor(upgrade.cost * Math.pow(1.15, upgrade.owned));
    
    if (cookies >= currentCost) {
      setCookies(prev => prev - currentCost);
      setClickPower(prev => prev + upgrade.multiplier);
      
      setUpgrades(prev => prev.map(u => 
        u.id === upgrade.id ? { ...u, owned: u.owned + 1 } : u
      ));
      
      toast({
        title: '✅ Куплено!',
        description: `${upgrade.name} (${upgrade.owned + 1})`,
        duration: 2000
      });
    } else {
      toast({
        title: '❌ Недостаточно печенек',
        description: `Нужно ещё ${currentCost - cookies} печенек`,
        variant: 'destructive',
        duration: 2000
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD700] via-[#FF6B6B] to-[#FFA07A] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 animate-bounce-in">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] tracking-tight">
            🍪 КЛИКЕР ИГРА
          </h1>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Badge className="text-2xl md:text-3xl px-6 py-3 bg-white text-black font-bold border-4 border-black shadow-lg">
              <Icon name="Cookie" className="mr-2" size={32} />
              {Math.floor(cookies)} печенек
            </Badge>
            <Badge className="text-xl md:text-2xl px-4 py-2 bg-[#4ECDC4] text-black font-bold border-4 border-black shadow-lg">
              <Icon name="Zap" className="mr-2" size={24} />
              +{clickPower} за клик
            </Badge>
          </div>
        </header>

        <Tabs defaultValue="game" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white border-4 border-black shadow-xl h-auto p-2 gap-2">
            <TabsTrigger value="game" className="text-base md:text-lg font-bold data-[state=active]:bg-[#FFD700] data-[state=active]:text-black border-2 border-black py-3">
              <Icon name="Gamepad2" className="mr-2" size={20} />
              Игра
            </TabsTrigger>
            <TabsTrigger value="shop" className="text-base md:text-lg font-bold data-[state=active]:bg-[#FF6B6B] data-[state=active]:text-white border-2 border-black py-3">
              <Icon name="ShoppingCart" className="mr-2" size={20} />
              Магазин
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-base md:text-lg font-bold data-[state=active]:bg-[#4ECDC4] data-[state=active]:text-black border-2 border-black py-3">
              <Icon name="Trophy" className="mr-2" size={20} />
              Награды
            </TabsTrigger>
            <TabsTrigger value="tutorial" className="text-base md:text-lg font-bold data-[state=active]:bg-[#FFA07A] data-[state=active]:text-white border-2 border-black py-3">
              <Icon name="BookOpen" className="mr-2" size={20} />
              Обучение
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="animate-fade-in">
            <Card className="p-8 md:p-12 bg-white border-8 border-black shadow-2xl">
              <div className="flex flex-col items-center justify-center gap-8">
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-black mb-4 text-black">
                    Кликай на печеньку!
                  </h2>
                  <p className="text-lg md:text-xl text-gray-700 font-semibold">
                    Каждый клик приносит {clickPower} печенек
                  </p>
                </div>
                
                <div className="relative">
                  <Button
                    onClick={handleClick}
                    className={`w-64 h-64 md:w-80 md:h-80 text-9xl rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF6B6B] hover:from-[#FF6B6B] hover:to-[#FFD700] border-8 border-black shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 ${clickAnimation ? 'bounce-click' : ''} pulse-glow`}
                  >
                    🍪
                  </Button>
                  
                  {floatingNumbers.map(float => (
                    <div
                      key={float.id}
                      className="absolute pointer-events-none text-4xl font-black text-white drop-shadow-lg float-up"
                      style={{ left: float.x, top: float.y }}
                    >
                      +{float.value}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
                  {upgrades.slice(0, 3).map(upgrade => (
                    <div key={upgrade.id} className="bg-[#FFF8DC] border-4 border-black rounded-xl p-4 text-center shadow-lg">
                      <div className="text-4xl mb-2">{upgrade.name.split(' ')[0]}</div>
                      <div className="font-bold text-sm">{upgrade.owned > 0 && `×${upgrade.owned}`}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="shop" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upgrades.map(upgrade => {
                const cost = Math.floor(upgrade.cost * Math.pow(1.15, upgrade.owned));
                const canAfford = cookies >= cost;
                
                return (
                  <Card
                    key={upgrade.id}
                    className="p-6 bg-white border-6 border-black shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FF6B6B] rounded-2xl border-4 border-black flex items-center justify-center text-3xl flex-shrink-0">
                        {upgrade.name.split(' ')[0]}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-black text-black mb-1">
                          {upgrade.name}
                        </h3>
                        <p className="text-sm md:text-base text-gray-700 font-semibold mb-2">
                          {upgrade.description}
                        </p>
                        
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex flex-col gap-1">
                            <Badge className="bg-[#4ECDC4] text-black font-bold border-2 border-black">
                              Стоимость: {cost} 🍪
                            </Badge>
                            {upgrade.owned > 0 && (
                              <Badge className="bg-[#FFD700] text-black font-bold border-2 border-black">
                                Куплено: {upgrade.owned}
                              </Badge>
                            )}
                          </div>
                          
                          <Button
                            onClick={() => buyUpgrade(upgrade)}
                            disabled={!canAfford}
                            className={`font-black border-4 border-black shadow-lg ${
                              canAfford
                                ? 'bg-[#FF6B6B] hover:bg-[#FFA07A] text-white'
                                : 'bg-gray-300 text-gray-600'
                            }`}
                          >
                            Купить
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map(achievement => (
                <Card
                  key={achievement.id}
                  className={`p-6 border-6 border-black shadow-xl transition-all ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-[#FFD700] to-[#FFA07A] scale-105'
                      : 'bg-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-20 h-20 rounded-full border-4 border-black flex items-center justify-center text-4xl ${
                      achievement.unlocked ? 'bg-white animate-wiggle' : 'bg-gray-300'
                    }`}>
                      {achievement.unlocked ? '🏆' : '🔒'}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-black text-black mb-1">
                        {achievement.name}
                      </h3>
                      <p className="text-sm md:text-base text-gray-800 font-semibold mb-2">
                        {achievement.description}
                      </p>
                      
                      {achievement.unlocked ? (
                        <Badge className="bg-white text-black font-bold border-2 border-black">
                          ✅ Разблокировано
                        </Badge>
                      ) : (
                        <Progress
                          value={Math.min((cookies / achievement.requirement) * 100, 100)}
                          className="h-3 border-2 border-black"
                        />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tutorial" className="animate-fade-in">
            <Card className="p-8 md:p-12 bg-white border-8 border-black shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-black text-black mb-6 text-center">
                📖 Как играть?
              </h2>
              
              <div className="space-y-6">
                <div className="bg-[#FFF8DC] border-4 border-black rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#FFD700] rounded-full border-4 border-black flex items-center justify-center text-2xl flex-shrink-0">
                      1️⃣
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-black mb-2">
                        Кликайте на печеньку
                      </h3>
                      <p className="text-base md:text-lg text-gray-800 font-medium">
                        Каждый клик приносит вам печеньки. Чем больше улучшений, тем больше печенек за клик!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FFF8DC] border-4 border-black rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#FF6B6B] rounded-full border-4 border-black flex items-center justify-center text-2xl flex-shrink-0">
                      2️⃣
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-black mb-2">
                        Покупайте улучшения
                      </h3>
                      <p className="text-base md:text-lg text-gray-800 font-medium">
                        В магазине можно купить улучшения, которые увеличивают силу клика. Цена растёт с каждой покупкой!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FFF8DC] border-4 border-black rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#4ECDC4] rounded-full border-4 border-black flex items-center justify-center text-2xl flex-shrink-0">
                      3️⃣
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-black mb-2">
                        Открывайте достижения
                      </h3>
                      <p className="text-base md:text-lg text-gray-800 font-medium">
                        Собирайте печеньки и покупайте улучшения, чтобы разблокировать все достижения!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#FFD700] to-[#FF6B6B] border-4 border-black rounded-2xl p-6 text-center">
                  <p className="text-xl md:text-2xl font-black text-white drop-shadow-lg">
                    🎮 Цель: собрать как можно больше печенек! 🍪
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
