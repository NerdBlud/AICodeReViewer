export function chunkDiff(diff, files, maxSize = 4000) {
  if (diff.length <= maxSize) {
    return [{
      content: diff,
      files: files.map(f => f.filename || f),
      size: diff.length
    }];
  }

  const chunks = [];
  const diffLines = diff.split('\n');
  
  let currentChunk = {
    content: '',
    files: [],
    size: 0
  };
  
  let currentFile = null;
  let fileBuffer = [];

  for (let i = 0; i < diffLines.length; i++) {
    const line = diffLines[i];
    
    if (line.startsWith('diff --git')) {
      if (currentFile && currentChunk.size > maxSize * 0.8) {
        const fileContent = fileBuffer.join('\n');
        currentChunk.content += fileContent + '\n';
        currentChunk.size += fileContent.length;
        
        chunks.push({ ...currentChunk });
        currentChunk = {
          content: '',
          files: [],
          size: 0
        };
        fileBuffer = [];
      }
      
      const match = line.match(/diff --git a\/(\S+) b\/(\S+)/);
      currentFile = match ? match[2] : null;
      
      if (currentFile && !currentChunk.files.includes(currentFile)) {
        currentChunk.files.push(currentFile);
      }
      
      fileBuffer = [line];
    } else {
      fileBuffer.push(line);
    }
    
    const bufferSize = fileBuffer.join('\n').length;
    if (currentChunk.size + bufferSize > maxSize && currentChunk.content.length > 0) {
      chunks.push({ ...currentChunk });
        currentChunk = {
        content: fileBuffer.join('\n') + '\n',
        files: currentFile ? [currentFile] : [],
        size: bufferSize
      };
      fileBuffer = [];
    }
  }

  if (fileBuffer.length > 0) {
    const fileContent = fileBuffer.join('\n');
    currentChunk.content += fileContent + '\n';
    currentChunk.size += fileContent.length;
  }

  if (currentChunk.content.trim().length > 0) {
    chunks.push(currentChunk);
  }

  if (chunks.length === 0) {
    return [{
      content: diff,
      files: files.map(f => f.filename || f),
      size: diff.length
    }];
  }

  return chunks;
}
export function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}


export function splitByFile(chunks) {
  const fileChunks = [];
  
  chunks.forEach(chunk => {
    chunk.files.forEach(file => {
      const filePattern = new RegExp(
        `diff --git a/${file} b/${file}[\\s\\S]*?(?=diff --git|$)`,
        'g'
      );
      
      const match = chunk.content.match(filePattern);
      if (match) {
        fileChunks.push({
          content: match[0],
          files: [file],
          size: match[0].length
        });
      }
    });
  });
  
  return fileChunks.length > 0 ? fileChunks : chunks;
}

export default { chunkDiff, estimateTokens, splitByFile };