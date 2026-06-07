# BrowserAct 可安装技能清单

本地仓库路径：`E:\临时项目\browseract-skills\repos\skills`

## 核心技能

- `browser-act`：浏览器自动化 CLI 使用说明和安全协议。
- `browser-act-skill-forge`：把网站探索结果生成可复用 Skill。

安装核心技能：

```powershell
E:\临时项目\browseract-skills\scripts\install-core-skills.ps1
```

## E-commerce

- `amazon-asin-lookup-api-skill`
- `amazon-best-selling-products-finder-api-skill`
- `amazon-buy-box-monitor-api-skill`
- `amazon-competitor-analyzer`
- `amazon-listing-competitor-analysis-skill`
- `amazon-product-api-skill`
- `amazon-product-search-api-skill`
- `amazon-reviews-api-skill`
- `ecommerce-listing`
- `ecommerce-product-detail`
- `ecommerce-reviews`
- `ecommerce-seller-info`

## Lead Generation

- `business-contact-social-links-skill`
- `github-project-contributor-finder-api-skill`
- `google-maps-api-skill`
- `google-maps-reviews-api-skill`
- `google-maps-search-api-skill`
- `google-social-media-finder`
- `industry-key-contact-radar-api-skill`
- `linkedin-jobs-search`
- `social-media-finder-skill`

## Search & Research

- `google-image-api-skill`
- `google-news-api-skill`
- `google-search-serp`
- `web-research-assistant`
- `web-search-scraper-api-skill`

## Social Listening

- `facebook-ads-library-search`
- `facebook-groups-scrape-posts`
- `facebook-page-posts`
- `facebook-page-profile-posts`
- `instagram-hashtag-posts`
- `instagram-place-posts`
- `instagram-post-comments`
- `instagram-profile-meta`
- `instagram-profile-posts`
- `reddit-competitor-analysis-api-skill`
- `wechat-article-search-api-skill`
- `x-dm-auto-chat`
- `x-tweet-search`
- `xiaohongshu-note-detail`
- `xiaohongshu-search`
- `xiaohongshu-user-profile`
- `zhihu-search-api-skill`

## Video Platforms

- `tiktok-hashtag-videos`
- `tiktok-profile-videos`
- `tiktok-search-videos`
- `tiktok-video-detail`
- `youtube-api-skill`
- `youtube-batch-transcript-extractor-api-skill`
- `youtube-channel-api-skill`
- `youtube-comments-api-skill`
- `youtube-influencer-finder-api-skill`
- `youtube-search-api-skill`
- `youtube-transcript`
- `youtube-transcript-analysis-api-skill`
- `youtube-transcript-extractor-api-skill`
- `youtube-video-api-skill`

## 单独安装 solution 技能

```powershell
E:\临时项目\browseract-skills\scripts\install-solution-skill.ps1 -Name xiaohongshu-search
E:\临时项目\browseract-skills\scripts\install-solution-skill.ps1 -Name youtube-transcript
```

安装后重启 Codex 才会加载新技能。
