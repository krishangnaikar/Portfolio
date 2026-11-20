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
        "date": "Nov 2023 – Present",
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
        "date": "Aug 2024 – May 2028",
    }
]

certifications = [
    {"name": "Google Cybersecurity Professional Certificate", "org": "Coursera", "year": "2024"},
    {"name": "Introduction to Self-Driving Cars", "org": "Coursera", "year": "2024"},
    {"name": "Machine Learning Specialization", "org": "Coursera", "year": "2022"},
    {"name": "AI Programming with Python", "org": "Udacity", "year": "2020"},
]

# Shared by the Flask page and the generated static export.
import json
from pathlib import Path

projects = json.loads(Path(__file__).with_name("projects.json").read_text())
project_categories = list(dict.fromkeys(p["category"] for p in projects))


@app.route("/")
def index():
    # Put your resume PDF at: static/resume/Krishang_Naikar_SWE_Intern_AI_ML_20250726.pdf
    return render_template(
        "index.html",
        profile=profile,
        skills=skills,
        experiences=experiences,
        education=education,
        certifications=certifications,
        projects=projects,
        project_categories=project_categories,
    )


@app.route("/recruiter")
def recruiter():
    resume_url = url_for("static", filename="resume/Resume8-18-25.pdf")
    featured_names = {
        "Multimodal Enterprise RAG",
        "Transistor Fine-Tuning and Tool-Use Evaluation",
        "Qiskit ket_basis Visualization",
    }
    featured_projects = [p for p in projects if p["name"] in featured_names]
    return render_template(
        "recruiter.html",
        profile=profile,
        skills=skills,
        experiences=experiences,
        education=education,
        certifications=certifications,
        featured_projects=featured_projects,
        resume_url=resume_url,
    )

if __name__ == "__main__":
    app.run(debug=True)
