import {
  bgGreen,
  bgRed,
  bgYellow,
  black,
  yellow,
} from "https://deno.land/std@0.97.0/fmt/colors.ts";
import { build } from "https://raw.githubusercontent.com/fromdeno/Nodeify/b815b006164c3185250d151bf494c9e352144900/nodeify.ts";

const testsToRun = new Set([
  // --
  // Working
  // "abort_controller_test.ts",
  // "build_test.ts",
  // "get_random_values_test.ts",
  "url_search_params_test.ts",
  // --
  // Failing
  // "blob_test.ts",
  // "body_test.ts",
  // "buffer_test.ts",
  // "chmod_test.ts",
  // "chown_test.ts",
  // "console_test.ts",
  // "copy_file_test.ts",
  // "custom_event_test.ts",
  // "dir_test.ts",
  // "error_stack_test.ts",
  // "event_target_test.ts",
  // "event_test.ts",
  // "fetch_test.ts",
  // "filereader_test.ts",
  // "files_test.ts",
  // "file_test.ts",
  // "format_error_test.ts",
  // "fs_events_test.ts",
  // "globals_test.ts",
  // "headers_test.ts",
  // "http_test.ts",
  // "internals_test.ts",
  // "io_test.ts",
  // "link_test.ts",
  // "make_temp_test.ts",
  // "metrics_test.ts",
  // "mkdir_test.ts",
  // "opcall_test.ts",
  // "os_test.ts",
  // "path_from_url_test.ts",
  // "performance_test.ts",
  // "permissions_test.ts",
  // "process_test.ts",
  // "progressevent_test.ts",
  // "read_dir_test.ts",
  // "read_file_test.ts",
  // "read_link_test.ts",
  // "read_text_file_test.ts",
  // "real_path_test.ts",
  // "remove_test.ts",
  // "rename_test.ts",
  // "request_test.ts",
  // "resources_test.ts",
  // "response_test.ts",
  // "stat_test.ts",
  // "stdio_test.ts",
  // "streams_deprecated.ts",
  // "symlink_test.ts",
  // "sync_test.ts",
  // "testing_test.ts",
  // "text_encoding_test.ts",
  // "timers_test.ts",
  // "tls_test.ts",
  // "truncate_test.ts",
  // "tty_test.ts",
  // "umask_test.ts",
  // "url_test.ts",
  // "utime_test.ts",
  // "version_test.ts",
  // "webgpu_test.ts",
  // "websocket_test.ts",
  // "worker_types.ts",
  // "write_file_test.ts",
  // "write_text_file_test.ts",
  // --
  // Hanging tests
  // "net_test.ts",
  // "signal_test.ts",
]);

const ok = new Set();
const failed = new Set();

let exitCode = 0;
for await (const e of Deno.readDir("vendor/deno/cli/tests/unit")) {
  if (e.isFile && e.name.endsWith("_test.ts")) {
    if (!testsToRun.has(e.name)) {
      console.log(yellow("skipping: " + e.name));
      continue; // Comment this to run all tests
    }
    await build(`vendor/deno/cli/tests/unit/${e.name}`, "unit");
    console.log(bgYellow(black(e.name + ":")));
    const status = await Deno.run({
      cmd: [
        "node",
        "dist/cli/test.js",
        `unit/file/vendor/deno/cli/tests/unit/${e.name}`,
      ],
      stdout: "inherit",
      stderr: "inherit",
    }).status();
    if (!status.success) {
      exitCode = status.code;
      console.log(bgRed("FAILED: " + e.name));
      failed.add(e.name);
    } else {
      console.log(bgGreen("OK: " + e.name));
      ok.add(e.name);
    }
  }
}

console.log(bgGreen("OK"), ok);
console.log(bgRed("FAILED"), failed);
Deno.exit(exitCode);