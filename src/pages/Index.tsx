import { useState, useEffect } from "react";
import { Search, Leaf } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HerbCard } from "@/components/HerbCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";
import { PlantScanner } from "@/components/PlantScanner";

interface Herb {
  id: string;
  name: string;
  scientific_name: string | null;
  description: string;
  category: string;
  image_url: string | null;
  benefits: string[];
}

const Index = () => {
  const [herbs, setHerbs] = useState<Herb[]>([]);
  const [filteredHerbs, setFilteredHerbs] = useState<Herb[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    fetchHerbs();
  }, []);

  useEffect(() => {
    filterHerbs();
  }, [searchQuery, categoryFilter, herbs]);

  const fetchHerbs = async () => {
    try {
      const { data, error } = await supabase.from("herbs").select("*");
      if (error) throw error;
      setHerbs(data || []);
    } catch (error) {
      toast({ title: "Error fetching herbs", description: "Please try again", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const filterHerbs = () => {
    let filtered = herbs;
    
    if (searchQuery) {
      filtered = filtered.filter(herb => 
        herb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        herb.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (categoryFilter !== "all") {
      filtered = filtered.filter(herb => herb.category.toLowerCase() === categoryFilter);
    }
    
    setFilteredHerbs(filtered);
  };

  const categories = ["all", ...new Set(herbs.map(h => h.category.toLowerCase()))];

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-end gap-2 mb-6">
            <LanguageSelector />
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
            <Leaf className="h-12 w-12 text-primary animate-pulse" />
            <h1 className="text-5xl font-bold text-foreground">{t('title')}</h1>
          </div>
          <p className="text-center text-xl text-muted-foreground mb-8 animate-fade-in">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <PlantScanner />
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder={t('category')} />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {t(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <Leaf className="h-12 w-12 animate-spin mx-auto text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredHerbs.map(herb => (
              <HerbCard key={herb.id} {...herb} scientificName={herb.scientific_name} imageUrl={herb.image_url} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
