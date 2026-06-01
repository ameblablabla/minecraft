async function loadVersionsFromURL(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

function compareSemver(versionA, versionB) {
    const partsA = versionA.split('.').map(Number);
    const partsB = versionB.split('.').map(Number);

    const maxLength = Math.max(partsA.length, partsB.length);

    for (let i = 0; i < maxLength; i++) {
        const numA = partsA[i] || 0;
        const numB = partsB[i] || 0;

        if (numA > numB) return 1;
        if (numA < numB) return -1;
    }

    return 0; // Versions are equal
}

function isVersionAllowed(version, minVersion = '1.19.4') {
    return compareSemver(version, minVersion) >= 0;
}

function groupByGameVersions(data) {
    const groupedVersion = {};

    data.forEach(item => {
        item.game_versions.forEach(version => {
            if (isVersionAllowed(version)) {
                if (!groupedVersion[version]) {
                    groupedVersion[version] = [];
                }
                groupedVersion[version].push(item);
            }
        });
    });

    return groupedVersion;
}

function getFirstVersionItem(versionItems, type) {
    for (let i = 0; i < versionItems.length; i++) {
        if (versionItems[i].version_type === type) {
            return { item: versionItems[i], index: i };
        }
    }
    return { item: null, index: -1 };
}

function getVersionToDisplay(groupedVersion) {
    const versionsToDisplay = [];

    for (const version in groupedVersion) {
        if (groupedVersion[version].length > 0) {
            const versionItems = groupedVersion[version];

            const firstRelease = getFirstVersionItem(versionItems, 'release');
            const firstBeta = getFirstVersionItem(versionItems, 'beta');
            const firstAlpha = getFirstVersionItem(versionItems, 'alpha');

            if (firstRelease.item) {
                versionsToDisplay.push(firstRelease.item);
            } else if (firstBeta.item) {
                versionsToDisplay.push(firstBeta.item);
            } else if (firstAlpha.item) versionsToDisplay.push(firstAlpha.item);

            for(const versionItem of versionItems){
                if(versionItem.name.includes('▫️'))
                    versionsToDisplay.push(versionItem);
            }
        }
    }

    // Sort versionsToDisplay by game_version field, to make newer versions appear first
    versionsToDisplay.sort((a, b) => compareSemver(b.game_versions[0], a.game_versions[0]));

    return versionsToDisplay;
}

function populateDropdownAndSetupButton(versions) {
    const versionsDropdown = document.getElementById('versionsDropdown');

    versions.forEach(version => {
        const option = document.createElement('option');
        option.textContent = version.name;
        option.value = version.files[0].url;
        versionsDropdown.appendChild(option);
    });

    const specialOption = document.createElement('option');
    specialOption.textContent = '4.6.1, 4.5.7, ...';
    specialOption.value = 'CurseForge';
    versionsDropdown.appendChild(specialOption);

    // Set up the "Go" button to download the selected pack or open the URL
    const goButton = document.getElementById('goButton');
    goButton.onclick = () => {
        const selectedURL = versionsDropdown.value;
        if (selectedURL === 'CurseForge') {
            window.open("https://www.curseforge.com/minecraft/modpacks/fabulously-optimized/files?showAlphaFiles=show", '_blank');
        } else {
            downloadPack(selectedURL);
        }
    };
}

const apiUrl = 'https://api.modrinth.com/v2/project/1KVo5zza/version';
const downloadParam = urlParams.get('download'); //urlParams from converter.js

loadVersionsFromURL(apiUrl)
    .then(data => {
        if (data) {
            const groupedVersion = groupByGameVersions(data);
            const versionsToDisplay = getVersionToDisplay(groupedVersion);
            populateDropdownAndSetupButton(versionsToDisplay);
            if (downloadParam === 'latest') {
                // Download the first (newest) item
                downloadPack(versionsToDisplay[0].files[0].url);
            } else if (downloadParam) {
                // Download specific version based on query parameter
                const foundVersion = versionsToDisplay.find(version => version.game_versions[0] === downloadParam);
                if (foundVersion) {
                    downloadPack(foundVersion.files[0].url);
                } else {
                    alert('Requested version not found');
                }
            }
        } else {
            console.error('Failed to load data');
        }
    })
    .catch(error => console.error('Error:', error));