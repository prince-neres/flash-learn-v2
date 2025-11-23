import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BookOpen, Globe2 } from "lucide-react";
import { DeckService, type Deck } from "../services/DeckService";
import { LoadingState } from "../components/LoadingState";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

const PublicDecks: React.FC = () => {
  const { t } = useTranslation();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const publicDecks = await DeckService.getPublicDecks();
        setDecks(publicDecks);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingState message={t("common.loading")} />;

  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <Globe2 className="h-3.5 w-3.5 text-primary" />
          {t("visibility.public")}
        </div>
        <div>
          <h1 className="text-3xl font-semibold">{t("publicDecks.title")}</h1>
          <p className="text-muted-foreground">{t("publicDecks.subtitle")}</p>
        </div>
      </div>

      {decks.length === 0 ? (
        <Card className="border-dashed text-center">
          <CardHeader>
            <BookOpen className="mx-auto h-12 w-12 text-primary" />
            <CardTitle>{t("publicDecks.title")}</CardTitle>
            <CardDescription>{t("publicDecks.emptyState")}</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {decks.map((deck) => (
            <Card key={deck.id} className="border-border/60 bg-card/80 p-1">
              <CardHeader>
                <CardTitle>{deck.title}</CardTitle>
                <CardDescription>
                  {t("publicDecks.owner", { name: deck.ownerName || t("leaderboard.anonymous") })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t("dashboard.cardCount", { count: deck.cardCount })}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="outline" className="flex-1">
                    <Link to={`/deck/${deck.id}`}>{t("publicDecks.open")}</Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link to={`/study/${deck.id}`}>{t("publicDecks.study")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicDecks;
