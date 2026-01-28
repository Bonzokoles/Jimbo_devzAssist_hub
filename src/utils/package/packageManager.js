// Package Manager Detection and Utilities

// Detect package manager from project files
export const detectPackageManager = async (projectPath = '.') => {
  try {
    // Check for lock files to determine package manager
    const checks = [
      { file: 'package-lock.json', manager: 'npm' },
      { file: 'yarn.lock', manager: 'yarn' },
      { file: 'pnpm-lock.yaml', manager: 'pnpm' },
      { file: 'bun.lockb', manager: 'bun' },
      { file: 'Cargo.lock', manager: 'cargo' },
      { file: 'requirements.txt', manager: 'pip' },
      { file: 'Pipfile', manager: 'pipenv' },
      { file: 'pyproject.toml', manager: 'poetry' },
      { file: 'Gemfile', manager: 'bundler' },
      { file: 'composer.json', manager: 'composer' },
      { file: 'go.mod', manager: 'go' },
      { file: 'pom.xml', manager: 'maven' },
      { file: 'build.gradle', manager: 'gradle' },
    ];
    
    // In a real implementation, we'd check if these files exist
    // For now, return a default based on common scenarios
    return 'npm';
  } catch (error) {
    console.error('Failed to detect package manager:', error);
    return 'npm';
  }
};

// Get install command for a package manager
export const getInstallCommand = (packageManager, packageName, isDev = false) => {
  const commands = {
    npm: isDev ? `npm install --save-dev ${packageName}` : `npm install ${packageName}`,
    yarn: isDev ? `yarn add --dev ${packageName}` : `yarn add ${packageName}`,
    pnpm: isDev ? `pnpm add -D ${packageName}` : `pnpm add ${packageName}`,
    bun: isDev ? `bun add -d ${packageName}` : `bun add ${packageName}`,
    pip: `pip install ${packageName}`,
    pipenv: `pipenv install ${packageName}`,
    poetry: `poetry add ${packageName}`,
    cargo: `cargo add ${packageName}`,
    bundler: `bundle add ${packageName}`,
    composer: `composer require ${packageName}`,
    go: `go get ${packageName}`,
    maven: `mvn install ${packageName}`,
    gradle: `gradle install ${packageName}`,
  };
  
  return commands[packageManager] || `${packageManager} install ${packageName}`;
};

// Get uninstall command for a package manager
export const getUninstallCommand = (packageManager, packageName) => {
  const commands = {
    npm: `npm uninstall ${packageName}`,
    yarn: `yarn remove ${packageName}`,
    pnpm: `pnpm remove ${packageName}`,
    bun: `bun remove ${packageName}`,
    pip: `pip uninstall ${packageName}`,
    pipenv: `pipenv uninstall ${packageName}`,
    poetry: `poetry remove ${packageName}`,
    cargo: `cargo remove ${packageName}`,
    bundler: `bundle remove ${packageName}`,
    composer: `composer remove ${packageName}`,
    go: `go get -u ${packageName}`,
    maven: `mvn uninstall ${packageName}`,
    gradle: `gradle remove ${packageName}`,
  };
  
  return commands[packageManager] || `${packageManager} uninstall ${packageName}`;
};

// Get list installed packages command
export const getListCommand = (packageManager) => {
  const commands = {
    npm: 'npm list --depth=0',
    yarn: 'yarn list --depth=0',
    pnpm: 'pnpm list --depth=0',
    bun: 'bun pm ls',
    pip: 'pip list',
    pipenv: 'pipenv graph',
    poetry: 'poetry show',
    cargo: 'cargo tree',
    bundler: 'bundle list',
    composer: 'composer show',
    go: 'go list -m all',
    maven: 'mvn dependency:list',
    gradle: 'gradle dependencies',
  };
  
  return commands[packageManager] || `${packageManager} list`;
};

// Get package manager registry/repository
export const getRegistry = (packageManager) => {
  const registries = {
    npm: 'https://registry.npmjs.org',
    yarn: 'https://registry.npmjs.org',
    pnpm: 'https://registry.npmjs.org',
    bun: 'https://registry.npmjs.org',
    pip: 'https://pypi.org',
    pipenv: 'https://pypi.org',
    poetry: 'https://pypi.org',
    cargo: 'https://crates.io',
    bundler: 'https://rubygems.org',
    composer: 'https://packagist.org',
    go: 'https://pkg.go.dev',
    maven: 'https://search.maven.org',
    gradle: 'https://search.maven.org',
  };
  
  return registries[packageManager] || '';
};

// Search packages in registry
export const searchPackages = async (packageManager, query) => {
  const registry = getRegistry(packageManager);
  
  try {
    if (packageManager === 'npm' || packageManager === 'yarn' || packageManager === 'pnpm' || packageManager === 'bun') {
      // NPM registry search
      const response = await fetch(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=20`);
      const data = await response.json();
      
      return data.objects.map(obj => ({
        name: obj.package.name,
        description: obj.package.description || '',
        version: obj.package.version,
        author: obj.package.author?.name || obj.package.publisher?.username || 'Unknown',
        homepage: obj.package.links?.homepage || obj.package.links?.repository || '',
        repository: obj.package.links?.repository || '',
        downloads: obj.package.downloads || 0,
        keywords: obj.package.keywords || [],
        license: obj.package.license || 'Unknown',
      }));
    } else if (packageManager === 'pip' || packageManager === 'pipenv' || packageManager === 'poetry') {
      // PyPI search
      const response = await fetch(`https://pypi.org/pypi/${encodeURIComponent(query)}/json`);
      if (!response.ok) {
        // Try search API
        return [];
      }
      const data = await response.json();
      
      return [{
        name: data.info.name,
        description: data.info.summary || '',
        version: data.info.version,
        author: data.info.author || 'Unknown',
        homepage: data.info.home_page || data.info.project_url || '',
        repository: data.info.project_urls?.['Source Code'] || '',
        downloads: 0,
        keywords: data.info.keywords ? data.info.keywords.split(',') : [],
        license: data.info.license || 'Unknown',
      }];
    } else if (packageManager === 'cargo') {
      // Crates.io search
      const response = await fetch(`https://crates.io/api/v1/crates?q=${encodeURIComponent(query)}&per_page=20`);
      const data = await response.json();
      
      return data.crates.map(crate => ({
        name: crate.name,
        description: crate.description || '',
        version: crate.max_version,
        author: crate.owner || 'Unknown',
        homepage: crate.homepage || crate.repository || '',
        repository: crate.repository || '',
        downloads: crate.downloads || 0,
        keywords: crate.keywords || [],
        license: crate.license || 'Unknown',
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Failed to search packages:', error);
    return [];
  }
};

// Get package info
export const getPackageInfo = async (packageManager, packageName) => {
  try {
    if (packageManager === 'npm' || packageManager === 'yarn' || packageManager === 'pnpm' || packageManager === 'bun') {
      const response = await fetch(`https://registry.npmjs.org/${packageName}`);
      const data = await response.json();
      
      const latestVersion = data['dist-tags']?.latest || Object.keys(data.versions).pop();
      const latest = data.versions[latestVersion];
      
      return {
        name: data.name,
        description: data.description || latest?.description || '',
        version: latestVersion,
        author: data.author?.name || latest?.author?.name || 'Unknown',
        homepage: data.homepage || latest?.homepage || '',
        repository: data.repository?.url || latest?.repository?.url || '',
        dependencies: latest?.dependencies || {},
        devDependencies: latest?.devDependencies || {},
        keywords: data.keywords || latest?.keywords || [],
        license: data.license || latest?.license || 'Unknown',
        readme: data.readme || '',
      };
    } else if (packageManager === 'pip' || packageManager === 'pipenv' || packageManager === 'poetry') {
      const response = await fetch(`https://pypi.org/pypi/${packageName}/json`);
      const data = await response.json();
      
      return {
        name: data.info.name,
        description: data.info.summary || '',
        version: data.info.version,
        author: data.info.author || 'Unknown',
        homepage: data.info.home_page || '',
        repository: data.info.project_urls?.['Source Code'] || '',
        dependencies: {},
        devDependencies: {},
        keywords: data.info.keywords ? data.info.keywords.split(',') : [],
        license: data.info.license || 'Unknown',
        readme: data.info.description || '',
      };
    } else if (packageManager === 'cargo') {
      const response = await fetch(`https://crates.io/api/v1/crates/${packageName}`);
      const data = await response.json();
      
      return {
        name: data.crate.name,
        description: data.crate.description || '',
        version: data.crate.max_version,
        author: 'Rust Community',
        homepage: data.crate.homepage || data.crate.repository || '',
        repository: data.crate.repository || '',
        dependencies: {},
        devDependencies: {},
        keywords: data.crate.keywords || [],
        license: data.crate.license || 'Unknown',
        readme: data.crate.readme || '',
      };
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get package info:', error);
    return null;
  }
};
