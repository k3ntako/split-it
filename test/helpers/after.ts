import del from 'del';

after(async () => {
  await del([process.cwd() + '/test/data']);
});