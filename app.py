from flask import Flask, render_template, url_for

app = Flask(__name__)

# ------------ Portfolio Data ------------
profile = {
    "name": "Krishang Naikar",
    "title": "Software Engineering Intern (AI/ML)",
    "summary": (
        "Software Engineering Intern with experience in automation, data pipelines, and "
        "workflow integrations. Comfortable shipping in Python and Java; eager to build "
        "scalable developer tooling and AI-backed systems."
    ),
    "location": "Fremont, CA",
    "phone": "+1 (510) 870-7022",
    "email": "krishangnaikar7@gmail.com",
    "github": "https://github.com/krishangnaikar",
    "linkedin": "https://www.linkedin.com/in/krishang-naikar-26aa6a255/",
}

skills = [
    {"label": "Languages", "items": ["Java", "Python", "C/C++", "SQL (Postgres)", "JavaScript", "HTML/CSS"]},
    {"label": "Frameworks", "items": ["Flask", "FastAPI"]},
    {"label": "Tools", "items": ["Git", "Docker", "Google Cloud Platform", "VS Code", "PyCharm",
                                 "IntelliJ", "Eclipse", "Ollama", "IDE Extension Development"]},
    {"label": "Libraries", "items": ["Pandas", "NumPy", "Matplotlib", "PyTorch", "Undetected Chromedriver",
                                     "Selenium", "Discord.py", "LangChain", "OpenAI"]},
]

experiences = [
    {
        "company": "Zentroq",
        "role": "Java & Python Developer",
        "location": "Fremont, CA",
        "date": "Nov 2023 – Present",
        "bullets": [
            "Integrated with two construction-industry APIs using Java.",
            "Built Java data pipelines processing large datasets into PostgreSQL.",
            "Automated large-scale web scraping with Python to enrich customer databases.",
        ],
    },
    {
        "company": "TrueNil",
        "role": "Software Engineer Intern",
        "location": "Fremont, CA",
        "date": "Nov 2023 – May 2024",
        "bullets": [
            "Collaborated with engineers to resolve codebase issues and improve reliability.",
            "Supported a ChatGPT-based product to ensure smooth functionality.",
        ],
    },
    {
        "company": "Gradachiever",
        "role": "Co-Founder",
        "location": "Fremont, CA",
        "date": "2021",
        "bullets": [
            "Designed automation programs to streamline workflows and surface opportunities.",
            "Aggregated college data (scores, tuition, addresses) from multiple sources.",
            "Integrated third-party platforms via data feeds and APIs.",
        ],
    },
]

education = [
    {
        "school": "San José State University",
        "degree": "B.S., Computer Science (Undergraduate)",
        "date": "Aug 2024 – May 2027",
    }
]

certifications = [
    {"name": "Google Cybersecurity Professional Certificate", "org": "Coursera", "year": "2024"},
    {"name": "Introduction to Self-Driving Cars", "org": "Coursera", "year": "2024"},
    {"name": "Machine Learning Specialization", "org": "Coursera", "year": "2022"},
    {"name": "AI Programming with Python", "org": "Udacity", "year": "2020"},
]

projects = [
    {
        "name": "Snake – Toy Programming Language",
        "year": "2024",
        "blurb": "Custom Python-inspired language with lexer, parser, interpreter, modules, and rich error reporting.",
        "tech": ["JavaScript", "Node.js"],
        "link": "https://github.com/krishangnaikar/snake-lang",
    },
    {
        "name": "Personal LLM Chatbot",
        "year": "2024",
        "blurb": "Local LLM chatbot (Ollama + Mistral) with Flask backend and responsive web UI; supports PDF/Doc ingestion.",
        "tech": ["Python", "Flask", "LLM", "Ollama"],
        "link": "https://github.com/krishangnaikar/LLMBot",
    },
    {
        "name": "WhatsApp Scraping & Messaging (Edu)",
        "year": "2023",
        "blurb": "Automated extraction of group phone numbers and batch messaging.",
        "tech": ["Python", "Selenium"],
        "link": "https://github.com/krishangnaikar/WhatsappScrapingMessaging",
    },
    {
        "name": "PlaygroundAI Discord Bot",
        "year": "2023",
        "blurb": "Discord bot with /imagine that fetches AI images from playgroundai.com prompts.",
        "tech": ["Python", "Discord API", "Web Scraping"],
        "link": "https://github.com/krishangnaikar/PlaygroundAIDiscordBot",
    },
    {
        "name": "College Info Automation",
        "year": "2023",
        "blurb": "Scraped SAT/ACT percentiles, tuition, and addresses across college sites.",
        "tech": ["Python", "Selenium"],
        "link": "https://github.com/krishangnaikar/CollegeInfoScraper",
    },
    {
        "name": "Streaming Video Download (Edu)",
        "year": "2023",
        "blurb": "Collected Azure Media streaming links and automated offline downloads.",
        "tech": ["Python"],
        "link": "https://github.com/krishangnaikar/Download-Steaming-Videos",
    },
    {
        "name": "Image Classifier (Udacity Final)",
        "year": "2020",
        "blurb": "PyTorch image classification CLI with tuning and inference utilities.",
        "tech": ["Python", "PyTorch"],
        "link": "https://github.com/krishangnaikar/Image-Classifier_FinalProject",
    },
]


@app.route("/")
def index():
    # Put your resume PDF at: static/resume/Krishang_Naikar_SWE_Intern_AI_ML_20250726.pdf
    resume_url = url_for("static", filename="resume/Resume8-18-25.pdf")
    return render_template(
        "index.html",
        profile=profile,
        skills=skills,
        experiences=experiences,
        education=education,
        certifications=certifications,
        projects=projects,
        resume_url=resume_url,
    )


if __name__ == "__main__":
    app.run(debug=True)
