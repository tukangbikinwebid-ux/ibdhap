"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye } from "lucide-react";
import Link from "next/link";

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  views: string;
  publishedAt: string;
  image?: string;
}

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link className="block" href={`/artikel/${article.slug}`}>
      <Card className="border-awqaf-border-light hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-16 h-16 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="w-8 h-8 bg-awqaf-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold font-comfortaa">
                  {article.title.charAt(0)}
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="secondary"
                  className="text-xs bg-accent-100 text-awqaf-primary"
                >
                  {article.category}
                </Badge>
                <span className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  {article.publishedAt}
                </span>
              </div>

              <h3 className="font-semibold text-card-foreground text-sm font-comfortaa mb-2 line-clamp-2">
                {article.title}
              </h3>

              <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mb-3 line-clamp-2">
                {article.excerpt}
              </p>

              {/* <div className="flex items-center gap-4 text-xs text-awqaf-foreground-secondary">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span className="font-comfortaa">{article.readTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span className="font-comfortaa">{article.views}</span>
                </div>
              </div> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
