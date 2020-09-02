# File System

File System is a javascript library that can store a directory in a single file
## Installation

Clone the github repo
```bash
npm install 
```
> Use `npm run compile` if you wish to compile it to javascript


## Usage

```typescript
import { FileSystem, Format } from "../src/core/include/filesystem"

const fsys = new FileSystem({
debug: false,
encrypt: true,
format: Format.HEX
});

// stores and returns the data in the directory, array of excluded directories
fsys.CreateSnapshot("./src/core", ["include"]); 

// saves the snapshot in the path as an fsys file
fsys.SaveSnapshot("./test/snapshots");

// loads the snapshot (fsys) file
fsys.LoadSnapshot("./test/snapshots/snapshot.fsys");

// recreats the directory in the path
fsys.DumpSnapshot("./test/snapshots/0");
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License
Licensed under [MIT](https://choosealicense.com/licenses/mit/) see [LICENSE](https://github.com/JosephCodemard/File-System/blob/master/LICENSE) for more details