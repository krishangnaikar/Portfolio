from flask import Flask, render_template, url_for

app = Flask(__name__)

# ------------ Portfolio Data ------------
profile = {
    "name": "Krishang Naikar",
    "title": "Computer Science Student • AI/ML Researcher",
    "summary": (
        "Computer science student at San José State University working across AI/ML, "
        "quantum computing, automation, and software engineering. Undergraduate research "
        "and project work spans model evaluation, developer tools, and full-stack applications."
    ),
    "location": "Fremont, CA",
    "phone": "+1 (510) 870-7022",
    "email": "krishangnaikar7@gmail.com",
    "github": "https://github.com/krishangnaikar",
    "linkedin": "https://www.linkedin.com/in/krishang-naikar-26aa6a255/",
}

skills = [
    {"label": "Languages", "items": ["Python", "Java", "C", "C++", "Assembly", "JavaScript", "SQL", "HTML/CSS"]},
    {"label": "Web & App Development", "items": ["Flask", "FastAPI", "React", "Next.js", "Node.js", "Electron", "React Native", "Tailwind CSS"]},
    {"label": "AI, ML & Data", "items": ["PyTorch", "LangChain", "Ollama", "Qdrant", "Pinecone", "Sentence Transformers", "NumPy", "Pandas", "CUDA-Q"]},
    {"label": "Tools", "items": ["Git", "GitHub", "Docker", "VS Code", "PyCharm", "IntelliJ IDEA", "Jupyter"]},
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

@app.route("/projects")
def projects_page():
    return render_template(
        "subpage.html",
        profile=profile,
        active_page="projects",
        page_label="SINGLEPLAYER",
        page_title="Select World",
        page_intro="Choose a project world to see what it does, the tools behind it, and where to explore the source.",
        page_type="projects",
        projects=projects,
    )


@app.route("/experience")
def experience_page():
    return render_template(
        "subpage.html",
        profile=profile,
        active_page="experience",
        page_label="MULTIPLAYER",
        page_title="Play Multiplayer",
        page_intro="Browse teams and roles from Krishang’s work and research experience.",
        page_type="experience",
        experiences=experiences,
    )


@app.route("/research")
def research_page():
    research_projects = [
        p for p in projects
        if p["category"] == "Research & Ideas"
    ]
    return render_template(
        "subpage.html",
        profile=profile,
        active_page="research",
        page_label="PROJECT ARCHIVES",
        page_title="Research Projects",
        page_intro="Explore research, investigations, and concepts from the project list.",
        page_type="research",
        projects=research_projects,
    )


@app.route("/skills")
def skills_page():
    return render_template(
        "subpage.html",
        profile=profile,
        active_page="skills",
        page_label="ADVANCEMENTS",
        page_title="Skills & Coursework",
        page_intro="A snapshot of tools, technologies, and learning that support the work.",
        page_type="skills",
        skills=skills,
        education=education,
        certifications=certifications,
    )


@app.route("/about")
def about_page():
    return render_template(
        "subpage.html",
        profile=profile,
        active_page="about",
        page_label="PLAYER PROFILE",
        page_title="About Krishang",
        page_intro="Computer science student at San José State University, building across AI, software, and research.",
        page_type="about",
        education=education,
        certifications=certifications,
    )

@app.route("/settings")
def settings_page():
    return render_template(
        "settings.html",
        profile=profile,
        page_label="SETTINGS",
    )


if __name__ == "__main__":
    app.run(debug=True)
