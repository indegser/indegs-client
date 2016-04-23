(function(global){
	ipc.on('os-dir', function(event){
		event.returnValue = COMMAND.GIT;
	});

	ipc.on('os-info', function(event){
		var res = {osType: os.type(), homeDir: os.homedir()};
		event.returnValue = res;
	});

	ipc.on('hash-gen', function(event, arg){
		var hash = md5(arg);
		event.returnValue = hash;
	});

	/* Git Command */
	// ipc.on('create-cover',function(event,arg){

	// })
	ipc.on('test-git',function(event,arg){
		var initCmd = '"' + COMMAND.GIT + '" init "' + arg.slice(0, -1) + '"';
		var addCmd = '"' + COMMAND.GIT + '" -C "' + arg.slice(0, -1) + '" add --all';
		var commitCmd = '"' + COMMAND.GIT + '" -C "' + arg.slice(0, -1) + '" commit -m "test"';
		var gcCmd = '"' + COMMAND.GIT + '" -C "' + arg.slice(0, -1) + '" gc --aggressive';
		execAsyn(initCmd,function(err,stdout,stderr){
			execAsyn(addCmd,function(err,stdout,stderr){
				execAsyn(commitCmd,function(err,stdout,stderr){
					execAsyn(gcCmd,function(err,stdout,stderr){
					})
				})
			})
		})
	});

	ipc.on('imageMagick-initialize',function(event,arg1,arg2){
		var cmd = '"' + COMMAND.IMAGEMAGICK + '" "' + arg1 + '" -resize 149x' + ' "' + arg2 + '"';
		execAsyn(cmd,function(err,stdout,stderr){
			console.log(err + ' ' + stdout + ' ' + stderr)
			event.sender.send('im-initialize-end');
		})
	});

	ipc.on('imageMagick',function(event,data){
		// var cmd = '"' + COMMAND.IMAGEMAGICK + '" "' + design.path + '[0]"' + ' "-profile" ' + '"bin/imagemagick/USWebCoatedSWOP.icc" ' + ' "' + design.image + '"';
		// execAsyn(cmd,function(err,stdout,stderr){
		// 	if(err) console.log(err);
		// 	console.log(stdout);
		// 	console.log(stderr);
		// })
		var design = data.design;
		var cover = data.cover;
		var image = data.image;
		var coverRatio = data.coverRatio;
		var imageRatio = data.imageRatio;

		var coverCmd = '"' + COMMAND.IMAGEMAGICK + '" "' + design.path + '[0]"' + ' "-resize" "' + coverRatio + '" "' + cover + '"';
		if(imageRatio != null){
			var imageCmd = '"' + COMMAND.IMAGEMAGICK + '" "' + design.path + '[0]"' + ' "-resize" "' + imageRatio + '" "' + image + '"';
		} else {
			var imageCmd = '"' + COMMAND.IMAGEMAGICK + '" "' + design.path + '[0]" "' + image + '"';
		}
		design.cover = cover;
		design.image = image;

		execAsyn(coverCmd,function(err,stdout,stderr){
			event.sender.send('cover-end',design);
			execAsyn(imageCmd,function(err,stdout,stderr){
				event.sender.send('image-end',design);
			})
		});
	});

	ipc.on('git-init', function(event, arg){
		var res = {cmd: {}, res: {}};
		res.cmd.init = '"' + COMMAND.GIT + '" init "' + arg.slice(0, -1) + '"';
		res.res.init = exec(res.cmd.init);
		event.returnValue = res;
	});

	ipc.on('git', function(event,design,dir){
		var version = design.version;
		var addCmd = '"' + COMMAND.GIT + '" -C "' + dir + '" add --all';
		var commitCmd = '"' + COMMAND.GIT + '" -C "' + dir + '" commit -m "' + version + '"';
		var gcCmd = '"' + COMMAND.GIT + '" -C "' + dir + '" gc --aggressive';

		execAsyn(addCmd,function(err,stdout,stderr){
			execAsyn(commitCmd,function(err,stdout,stderr){
				var split = stdout.split(']')[0];
				var hash = split.slice(split.length-7,split.length);
				event.sender.send('git-end',design,hash)
				execAsyn(gcCmd,function(err,stdout,stderr){
					event.sender.send('gc-end',design)
				});
			})
		})
	});

	ipc.on('revert-commit',function(event,dir,version){
		var addCmd = '"' + COMMAND.GIT + '" -C "' + dir + '" add --all';
		var commitCmd = '"' + COMMAND.GIT + '" -C "' + dir + '" commit -m "' + version.name + '"';
		var gcCmd = '"' + COMMAND.GIT + '" -C "' + dir + '" gc --aggressive';
		execAsyn(addCmd,function(err,stdout,stderr){
			execAsyn(commitCmd,function(err,stdout,stderr){
				var split = stdout.split(']')[0];
				var hash = split.slice(split.length-7,split.length);
				event.sender.send('revert-commit-end',version,hash);
				execAsyn(gcCmd,function(err,stdout,stderr){
				});
			})
		})
	})
	
	ipc.on('git-delete',function(event,dir,version){
		var innerCmd = 'git rm --cached --ignore-unmatch "' + version.versionFile +'"';
		var cmd = '"' + COMMAND.GIT + '" -C "' + dir + '" filter-branch --index-filter ' + '\'' + innerCmd + '\'' + ' -- ' + version.hash+'^..';
		execAsyn(cmd,function(err,stdout,stderr){
			event.sender.send('git-delete-finish',version)
		})
	});
	ipc.on('git-prune',function(event,dir,version){
		var gcCmd = '"' + COMMAND.GIT + '" -C "' + dir + '" gc';
		var pruneCmd = '"' + COMMAND.GIT + '" -C "' + dir + '" prune --expire '+version.hash;
		execAsyn(gcCmd,function(err,stdout,stderr){
			execAsyn(pruneCmd,function(err,stdout,stderr){
				event.sender.send('git-prune-finish',version)
			})
		})
	});
	ipc.on('checkout-hash', function(event, dir, version){
		checkoutCmd = '"' + COMMAND.GIT + '" -C "' + dir + '" checkout ' + version.hash;
		execAsyn(checkoutCmd,function(err,stdout,stderr){
			event.sender.send('checkout-hash-finish',version);
		});
	});
	ipc.on('checkout-master', function(event, dir, version){
		checkoutCmd = '"' + COMMAND.GIT + '" -C "' + dir + '" checkout master';
		execAsyn(checkoutCmd,function(err,stdout,stderr){
			event.sender.send('checkout-master-finish',version);
		});
	});
})(global);