import { createStore } from 'vuex';

export default createStore({
  state: {
    tabAuthorshipInfo: {},
    tabZoomInfo: {},
    summaryDates: {},
    mergedGroups: [],
    fileTypeColors: {},
    loadingOverlayCount: 0,
    loadingOverlayMessage: '',
    isTabActive: true,
  },
  mutations: {
    updateTabZoomInfo(state, info) {
      state.tabZoomInfo = info;
    },
    updateTabAuthorshipInfo(state, info) {
      state.tabAuthorshipInfo = info;
    },
    updateSummaryDates(state, info) {
      state.summaryDates = info;
    },
    updateFileTypeColors(state, info) {
      state.fileTypeColors = info;
    },
    updateMergedGroup(state, info) {
      state.mergedGroups = info;
    },
    incrementLoadingOverlayCount(state, increment) {
      state.loadingOverlayCount += increment;
      if (state.loadingOverlayCount === 0) {
        state.loadingOverlayMessage = 'Loading. Please wait...';
      }
    },
    updateLoadingOverlayMessage(state, message) {
      state.loadingOverlayMessage = message;
    },
    updateTabState(state, isTabOpen) {
      state.isTabActive = isTabOpen;
      window.addHash('tabOpen', isTabOpen);
      if (!isTabOpen) {
        window.removeHash('tabType');
      }
      window.encodeHash();
    },
    toggleZoomCommitMessageBody(state, commitHash) {
      state.tabZoomInfo.zUser.commits.forEach((commit) => {
        const toUpdate = commit.commitResults.find((slice) => slice.hash === commitHash);
        if (toUpdate && toUpdate.isOpen !== undefined) {
          toUpdate.isOpen = !toUpdate.isOpen;
        }
      });
    },
    setAllZoomCommitMessageBody(state, { isExpand, commitHashes }) {
      state.tabZoomInfo.zUser.commits.forEach((commit) => {
        commit.commitResults.forEach((slice) => {
          if (slice.isOpen !== undefined && commitHashes.includes(slice.hash)) {
            slice.isOpen = isExpand;
          }
        });
      });
    },
    updateTabAuthorshipFiles(state, files) {
      state.tabAuthorshipInfo.files.splice(0, state.tabAuthorshipInfo.files.length, ...files);
    },
    toggleAuthorshipFileActiveProperty(_, file) {
      file.active = !file.active;
      file.wasCodeLoaded = file.wasCodeLoaded || file.active;
    },
    setAllAuthorshipFileActiveProperty(_, { isActive, files }) {
      files.forEach((file) => {
        file.active = isActive;
        file.wasCodeLoaded = file.wasCodeLoaded || file.active;
      });
    },
  },
  actions: {
    // Actions are called with dispatch

    async incrementLoadingOverlayCountForceReload({ commit }, increment) {
      commit('incrementLoadingOverlayCount', increment);
      await new Promise(window.requestAnimationFrame);
      await new Promise(window.requestAnimationFrame);
      // Needed as browsers render lazily by default
      // https://stackoverflow.com/a/44146560
    },
  },
});
