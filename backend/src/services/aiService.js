/**
 * AI Service for Heuristic Sentiment Analysis and Recommendations
 */

const POSITIVE_KEYWORDS = [
    "great", "amazing", "good", "excellent", "fun", "enjoyed", "organized",
    "best", "love", "loved", "perfect", "awesome", "fantastic", "smooth"
];

const NEGATIVE_KEYWORDS = [
    "bad", "boring", "disorganized", "poor", "worst", "hate", "hated",
    "waste", "unclear", "delayed", "late", "terrible", "noisy", "crowded"
];

const FEATURE_KEYWORDS = {
    "venue": ["place", "location", "room", "venue", "set up"],
    "timing": ["time", "start", "end", "duration", "delayed", "punctual"],
    "organization": ["management", "organized", "coordination", "volunteers"],
    "atmosphere": ["vibe", "energy", "music", "crowd", "fun"]
};

export const analyzeSentiment = (feedbackList) => {
    if (!feedbackList || feedbackList.length === 0) return { score: 0, label: "Neutral" };

    let totalScore = 0;
    feedbackList.forEach(f => {
        const text = f.comments.toLowerCase();
        POSITIVE_KEYWORDS.forEach(kw => { if (text.includes(kw)) totalScore += 1; });
        NEGATIVE_KEYWORDS.forEach(kw => { if (text.includes(kw)) totalScore -= 1; });
    });

    const avgScore = totalScore / feedbackList.length;
    let label = "Neutral";
    if (avgScore > 0.5) label = "Positive";
    if (avgScore > 1.2) label = "Very Positive";
    if (avgScore < -0.5) label = "Negative";

    return { score: avgScore.toFixed(2), label };
};

export const summarizeFeedback = (feedbackList) => {
    if (!feedbackList || feedbackList.length === 0) return { pros: [], cons: [] };

    const prosCount = {};
    const consCount = {};

    feedbackList.forEach(f => {
        const text = f.comments.toLowerCase();

        Object.entries(FEATURE_KEYWORDS).forEach(([feature, keywords]) => {
            const hasKeyword = keywords.some(kw => text.includes(kw));
            if (hasKeyword) {
                const isPositive = POSITIVE_KEYWORDS.some(kw => text.includes(kw));
                const isNegative = NEGATIVE_KEYWORDS.some(kw => text.includes(kw));

                if (isPositive) prosCount[feature] = (prosCount[feature] || 0) + 1;
                if (isNegative) consCount[feature] = (consCount[feature] || 0) + 1;
            }
        });
    });

    const pros = Object.entries(prosCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([f]) => f.charAt(0).toUpperCase() + f.slice(1));

    const cons = Object.entries(consCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([f]) => f.charAt(0).toUpperCase() + f.slice(1));

    return { pros, cons };
};
