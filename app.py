"""
Finvers AI — Flask backend
--------------------------------
Serves the frontend and exposes mock endpoints shaped exactly like the
future real endpoints, so a Python multi-agent backend can be dropped
in later without touching the frontend.

Run:
    pip install -r requirements.txt
    python app.py
Then open http://127.0.0.1:5000
"""

import random
from datetime import datetime, timedelta

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

# ---------------------------------------------------------------------------
# Mock data layer. Swap this module for real agent calls later — every
# response below is exactly what a real orchestrator would be expected
# to return, so the frontend never needs to change shape.
# ---------------------------------------------------------------------------

AGENT_MESSAGES = [
    {"text": "Connecting to the web...", "icon": "\U0001F577\uFE0F"},
    {"text": "News spider is crawling through headlines...", "icon": "\U0001F4F0"},
    {"text": "Fundamental spider is counting numbers...", "icon": "\U0001F4CA"},
    {"text": "Market spider is staring intensely at charts...", "icon": "\U0001F4C8"},
    {"text": "Risk spider found something suspicious...", "icon": "\U0001F440"},
    {"text": "Synthesis spider is connecting the dots...", "icon": "\U0001F9E0"},
    {"text": "The web is complete.", "icon": "\u2705"},
]

MOCK_COMPANIES = {
    "tata motors": {
        "symbol": "TATAMOTORS",
        "name": "Tata Motors",
        "score": 7.4,
        "verdict": "Moderately Positive",
        "agents": {
            "news": {"score": 8.0, "label": "Positive"},
            "fundamentals": {"score": 7.5, "label": "Strong"},
            "market": {"score": 7.0, "label": "Bullish"},
            "risk": {"level": "Medium"},
        },
        "breakdown": [
            {"label": "Positive news", "value": 1.2},
            {"label": "Revenue growth", "value": 1.0},
            {"label": "Market trend", "value": 0.8},
            {"label": "Valuation concern", "value": -0.4},
            {"label": "Volatility", "value": -0.2},
        ],
        "fundamentals_detail": {
            "Revenue": "\u20b91,05,932 Cr (+8.6% YoY)",
            "Profit": "\u20b97,021 Cr (+12.1% YoY)",
            "P/E": "18.4x",
            "ROE": "22.7%",
            "Debt": "Reducing, net debt-to-equity 0.4",
        },
        "market_detail": {
            "Trend": "Uptrend over 3 months",
            "Volatility": "Moderate (\u03b2 1.2)",
            "Performance": "+14.3% (90d)",
        },
        "news_items": [
            "New EV platform announcement well received by analysts",
            "Q2 export numbers beat street estimates",
            "Minor recall notice for a legacy model, limited impact",
        ],
        "risk_factors": [
            "Exposure to raw material price swings",
            "EV segment still investment-heavy, margins thin",
            "Global auto demand softness in select markets",
        ],
        "synthesis": {
            "assessment": "Momentum backed by real fundamentals, not just sentiment.",
            "strengths": ["Consistent revenue growth", "Improving balance sheet", "Strong EV narrative"],
            "concerns": ["Valuation running slightly ahead of history", "Cyclical demand risk"],
            "summary": "The web sees more green threads than red ones — encouraging, not conclusive.",
        },
    },
    "reliance": {
        "symbol": "RELIANCE",
        "name": "Reliance Industries",
        "score": 8.1,
        "verdict": "Positive",
        "agents": {
            "news": {"score": 8.3, "label": "Positive"},
            "fundamentals": {"score": 8.4, "label": "Strong"},
            "market": {"score": 7.8, "label": "Bullish"},
            "risk": {"level": "Low-Medium"},
        },
        "breakdown": [
            {"label": "Positive news", "value": 1.1},
            {"label": "Revenue growth", "value": 1.3},
            {"label": "Market trend", "value": 0.9},
            {"label": "Valuation concern", "value": -0.2},
            {"label": "Volatility", "value": -0.1},
        ],
        "fundamentals_detail": {
            "Revenue": "\u20b92,48,000 Cr (+7.1% YoY)",
            "Profit": "\u20b919,878 Cr (+10.4% YoY)",
            "P/E": "24.1x",
            "ROE": "19.3%",
            "Debt": "Stable, well covered by cash flow",
        },
        "market_detail": {
            "Trend": "Steady uptrend over 6 months",
            "Volatility": "Low (\u03b2 0.9)",
            "Performance": "+11.8% (90d)",
        },
        "news_items": [
            "Retail arm reports record festive-season footfall",
            "Jio subscriber base grows for fifth straight quarter",
            "New energy division breaks ground on second plant",
        ],
        "risk_factors": [
            "Large capex cycle in new energy still unproven",
            "Regulatory attention on telecom pricing",
        ],
        "synthesis": {
            "assessment": "Diversified engine running on most cylinders at once.",
            "strengths": ["Multiple growing business lines", "Strong cash generation", "Low volatility"],
            "concerns": ["New energy bets are long-duration", "Conglomerate complexity"],
            "summary": "Eight legs, all pointing roughly the same direction.",
        },
    },
    "infosys": {
        "symbol": "INFY",
        "name": "Infosys",
        "score": 7.8,
        "verdict": "Positive",
        "agents": {
            "news": {"score": 7.4, "label": "Positive"},
            "fundamentals": {"score": 8.0, "label": "Strong"},
            "market": {"score": 7.6, "label": "Bullish"},
            "risk": {"level": "Low"},
        },
        "breakdown": [
            {"label": "Positive news", "value": 0.9},
            {"label": "Revenue growth", "value": 0.8},
            {"label": "Market trend", "value": 0.7},
            {"label": "Valuation concern", "value": -0.3},
            {"label": "Volatility", "value": -0.1},
        ],
        "fundamentals_detail": {
            "Revenue": "\u20b940,986 Cr (+5.2% YoY)",
            "Profit": "\u20b96,506 Cr (+9.8% YoY)",
            "P/E": "27.6x",
            "ROE": "31.2%",
            "Debt": "Effectively debt-free",
        },
        "market_detail": {
            "Trend": "Range-bound, mild uptrend",
            "Volatility": "Low (\u03b2 0.7)",
            "Performance": "+6.4% (90d)",
        },
        "news_items": [
            "Large deal wins in North America BFSI segment",
            "AI services unit sees fastest growth in company",
            "Attrition rate falls to multi-year low",
        ],
        "risk_factors": [
            "Client budgets in discretionary IT spend remain cautious",
            "Currency fluctuation exposure",
        ],
        "synthesis": {
            "assessment": "Slow and steady, with an AI-shaped tailwind building.",
            "strengths": ["Deal pipeline strength", "High capital efficiency", "Clean balance sheet"],
            "concerns": ["Discretionary spending still soft", "Rich valuation vs. peers"],
            "summary": "Not the loudest thread in the web, but one of the sturdiest.",
        },
    },
}

DEFAULT_TEMPLATE_KEY = "tata motors"


def _seeded_variation(seed_text: str, base_score: float, spread: float = 1.0) -> float:
    rng = random.Random(seed_text)
    val = base_score + rng.uniform(-spread, spread)
    return round(max(1.0, min(9.8, val)), 1)


def get_company_payload(query: str) -> dict:
    """Return a full mock analysis payload for any typed company name.

    Known demo companies return curated data; anything else generates a
    deterministic (seeded) but plausible-looking mock payload so the whole
    flow works for arbitrary user input, exactly as a real backend would.
    """
    key = query.strip().lower()
    if key in MOCK_COMPANIES:
        payload = MOCK_COMPANIES[key]
    else:
        template = MOCK_COMPANIES[DEFAULT_TEMPLATE_KEY]
        rng = random.Random(key or "Finvers")
        score = _seeded_variation(key, 6.8, 1.6)
        payload = {
            "symbol": "".join(w[:1] for w in query.split()).upper() or "N/A",
            "name": query.strip().title() if query.strip() else "Unknown Company",
            "score": score,
            "verdict": (
                "Positive" if score >= 7.5 else
                "Moderately Positive" if score >= 6 else
                "Cautious" if score >= 4.5 else
                "Bearish"
            ),
            "agents": {
                "news": {"score": _seeded_variation(key + "n", score, 1.2), "label": "Positive" if score >= 6 else "Mixed"},
                "fundamentals": {"score": _seeded_variation(key + "f", score, 1.0), "label": "Strong" if score >= 6.5 else "Developing"},
                "market": {"score": _seeded_variation(key + "m", score, 1.2), "label": "Bullish" if score >= 6.5 else "Neutral"},
                "risk": {"level": rng.choice(["Low", "Low-Medium", "Medium", "Medium-High"])},
            },
            "breakdown": template["breakdown"],
            "fundamentals_detail": template["fundamentals_detail"],
            "market_detail": template["market_detail"],
            "news_items": template["news_items"],
            "risk_factors": template["risk_factors"],
            "synthesis": template["synthesis"],
        }
    payload = dict(payload)
    payload["as_of"] = (datetime.utcnow()).strftime("%d %b %Y, %H:%M UTC")
    return payload


# ---------------------------------------------------------------------------
# Page routes
# ---------------------------------------------------------------------------

@app.route("/")
def index():
    return render_template("index.html", active="home")


@app.route("/analyze")
def analyze():
    return render_template("analyze.html", active="analyze")


@app.route("/results")
def results():
    query = request.args.get("q", "Tata Motors")
    data = get_company_payload(query)
    return render_template("results.html", active="analyze", data=data)


@app.route("/network")
def network():
    return render_template("network.html", active="network")


@app.route("/watchlist")
def watchlist():
    return render_template("watchlist.html", active="watchlist")


@app.route("/about")
def about():
    return render_template("about.html", active="about")


# ---------------------------------------------------------------------------
# JSON API — this is the seam where a real multi-agent backend plugs in.
# ---------------------------------------------------------------------------

@app.route("/api/agent-messages")
def api_agent_messages():
    return jsonify(AGENT_MESSAGES)


@app.route("/api/analyze")
def api_analyze():
    query = request.args.get("q", "").strip()
    if not query:
        return jsonify({"error": "empty_query"}), 400
    return jsonify(get_company_payload(query))


if __name__ == "__main__":
    app.run(debug=True)
