import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandTwitter,
  IconBrandWikipedia,
  IconBrandYoutube,
} from "@tabler/icons-react";

type ExternalIds = {
  imdb_id?: string | null;
  facebook_id?: string | null;
  instagram_id?: string | null;
  twitter_id?: string | null;
  wikidata_id?: string | null;
  tik_tok_id?: string | null;
  youtube_id?: string | null;
};

export function getSocialLinks(externalIds: ExternalIds) {
  return [
    {
      id: externalIds?.imdb_id,
      url: `https://www.imdb.com/title/${externalIds?.imdb_id}`,
      icon: (
        <span className="text-[8px] font-black tracking-tighter select-none scale-95">
          IMDb
        </span>
      ),
      label: "IMDb",
    },
    {
      id: externalIds?.facebook_id,
      url: `https://www.facebook.com/${externalIds?.facebook_id}`,
      icon: <IconBrandFacebook className="h-5 w-5" />,
      label: "Facebook",
    },
    {
      id: externalIds?.instagram_id,
      url: `https://www.instagram.com/${externalIds?.instagram_id}`,
      icon: <IconBrandInstagram className="h-5 w-5" />,
      label: "Instagram",
    },
    {
      id: externalIds?.twitter_id,
      url: `https://twitter.com/${externalIds?.twitter_id}`,
      icon: <IconBrandTwitter className="h-5 w-5" />,
      label: "Twitter",
    },
    {
      id: externalIds?.wikidata_id,
      url: `https://www.wikidata.org/wiki/${externalIds?.wikidata_id}`,
      icon: <IconBrandWikipedia className="h-5 w-5" />,
      label: "Wiki",
    },
    {
      id: externalIds?.tik_tok_id,
      url: `https://www.tiktok.com/@${externalIds?.tik_tok_id}`,
      icon: <IconBrandTiktok className="h-5 w-5" />,
      label: "TikTok",
    },
    {
      id: externalIds?.youtube_id,
      url: `https://www.youtube.com/@${externalIds?.youtube_id}`,
      icon: <IconBrandYoutube className="h-5 w-5" />,
      label: "YouTube",
    },
  ];
}
