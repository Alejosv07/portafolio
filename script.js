tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#4f46e5",
                "background-light": "#ffffff",
                "background-dark": "#1a1a1b",
            },
            fontFamily: { "display": ["Public Sans", "sans-serif"] },
        },
    },
};

const GITHUB_USERNAME = 'Alejosv07';
const repoContainer = document.getElementById('repo-container');

async function fetchRepos() {
    try {

        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=created&direction=desc&per_page=100`);
        const repos = await response.json();

        repoContainer.innerHTML = '';

        for (const repo of repos) {
            if (!repo.fork && repo.name.toLowerCase() !== 'portafolio') {

                const card = createRepoCard(repo);
                repoContainer.appendChild(card);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function createRepoCard(repo) {
    const div = document.createElement('div');

    const year = new Date(repo.created_at).getFullYear();

    let deployUrl = repo.homepage || (repo.has_pages ? `https://${GITHUB_USERNAME}.github.io/${repo.name}/` : null);

    div.className = `group bg-white dark:bg-slate-900 border ${deployUrl ? 'border-primary/40 shadow-lg' : 'border-slate-200 dark:border-slate-800'} rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col`;

    const branch = repo.default_branch || 'main';
    const imageUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/${branch}/preview.png`;
    const fallbackImage = `https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop`;

    const techStack = repo.language ? `
        <span class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase rounded-md border border-slate-200 dark:border-slate-700 transition-colors group-hover:border-primary/30 group-hover:text-primary">
            ${repo.language}
        </span>
    ` : '';

    div.innerHTML = `
        <div class="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
            <img src="${imageUrl}" onerror="this.onerror=null; this.src='${fallbackImage}';" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            
            <div class="absolute top-4 left-4">
                <span class="px-2 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/20">
                    ${year}
                </span>
            </div>

            ${deployUrl ? `<div class="absolute top-4 right-4"><span class="px-3 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full animate-pulse">LIVE</span></div>` : ''}
        </div>

        <div class="p-8 flex-grow flex flex-col">
            <h3 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 capitalize">
                ${repo.name.replace(/-/g, ' ')}
            </h3>
            
            <p class="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed line-clamp-2 text-sm">
                ${repo.description || "Desarrollo web."}
            </p>

            <div class="flex flex-wrap gap-2 mb-8">
                ${techStack}
            </div>

            <div class="flex flex-col gap-3 mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                ${deployUrl ? `
                    <a href="${deployUrl}" target="_blank" class="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm text-center hover:opacity-90 flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-sm">rocket_launch</span> Ver Demo
                    </a>
                ` : ''}
                <a href="${repo.html_url}" target="_blank" class="w-full py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm text-center hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-sm">code</span> GitHub
                </a>
            </div>
        </div>
    `;
    return div;
}

document.addEventListener('DOMContentLoaded', fetchRepos);