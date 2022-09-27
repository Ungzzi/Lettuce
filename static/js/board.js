// 모달 게시글 불러오기
function getItem(boardId) {
    new Promise((resolve) => {
        setTimeout(async () => {
            const data = await axios.get(`/profile/board?id=${boardId}`);
            resolve(data.data);
        }, 100);
    }).then(async (data) => {
        console.log(data);
        if (data.code == 200) {
            $("#board-main").empty();
            const main = document.querySelector("#board-main");
            const ele = data.data;
            const card = document.createElement("div");
            // card.setAttribute("cnt", cnt);
            card.classList.add("card");
            const header = document.createElement("header");
            const profile = document.createElement("img");

            profile.setAttribute("src", ele["User.profile"]);
            const profileWrapper = document.createElement("a");
            profileWrapper.classList.add("profileWrapper");
            profileWrapper.appendChild(profile);
            profileWrapper.setAttribute(
                "href",
                `/profile?id=${ele["User.id"]}`
            );

            const nickName = document.createElement("span");
            nickName.innerText = ele["User.nickName"];
            const nickNameWrapper = document.createElement("a");
            nickNameWrapper.classList.add("nickNameWrapper");
            nickNameWrapper.appendChild(nickName);
            nickNameWrapper.setAttribute(
                "href",
                `profile?id=${ele["User.id"]}`
            );

            const createdAt = document.createElement("span");
            createdAt.innerText = ele.createdAt;
            createdAt.classList.add("createdAt");
            header.appendChild(profileWrapper);
            header.appendChild(nickNameWrapper);
            header.appendChild(createdAt);
            card.appendChild(header);
            const carousel = document.createElement("div");
            carousel.setAttribute("id", `a${ele.id}`);
            carousel.setAttribute("class", "carousel slide");
            carousel.setAttribute("data-ride", "carousel");
            const indicator = document.createElement("div");
            indicator.setAttribute("class", "carousel-indicators");

            let ccount = 1;
            console.log(ele.src);
            indicator.innerHTML += `<button type="button" data-bs-target="#a${ele.id}" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>`;
            for (let k = 0; k < ele.src.length - 1; k++) {
                indicator.innerHTML += ` <button type="button" data-bs-target="#a${ele.id
                    }" data-bs-slide-to="${ccount}" aria-label="Slide ${ccount + 1
                    }"></button>`;
                ccount += 1;
            }

            carousel.appendChild(indicator);
            const wrapper = document.createElement("div");
            wrapper.setAttribute("class", "carousel-inner");
            let numCnt = 0;
            ele.src.forEach((element) => {
                if ((element.type = "img")) {
                    let flag = "active";
                    if (numCnt != 0) {
                        flag = "";
                    }
                    numCnt += 1;
                    const Img = document.createElement("div");
                    Img.setAttribute("class", `carousel-item ${flag}`);
                    const img = document.createElement("img");
                    img.setAttribute("src", element.src);
                    img.setAttribute("alt", "...");
                    img.setAttribute("class", "d-block w-100");
                    Img.appendChild(img);
                    wrapper.appendChild(Img);
                } else {
                    const Img = document.createElement("div");
                    Img.setAttribute("class", "carousel-item active");
                    Img.setAttribute("data-carousel-item");
                    const video = document.createElement("video");
                    const source = document.createElement("source");
                    source.setAttribute("src", element.src);
                    source.setAttribute("type", "mp4");
                    video.appendChild(source);
                    Img.appendChild(video);
                    wrapper.appendChild(Img);
                }
            });
            carousel.appendChild(wrapper);
            carousel.innerHTML += `<button class="carousel-control-prev" type="button" data-bs-target="#a${ele.id}" data-bs-slide="prev"> <span class="carousel-control-prev-icon" aria-hidden="true"></span> <span class="visually-hidden">Previous</span> </button> <button class="carousel-control-next" type="button" data-bs-target="#a${ele.id}" data-bs-slide="next"> <span class="carousel-control-next-icon" aria-hidden="true"></span> <span class="visually-hidden">Next</span> </button></div>
                            `;
            let flag = "bi-heart"; //좋아요가 없는 상태
            let value = "0"; //좋아요가 없는 상태
            if (ele.like) {
                flag = "bi-heart-fill";
                value = "1";
            }
            let flag2 = "bi-bookmark";
            let value2 = "0";
            console.log("ele", ele);
            if (ele.bookmark) {
                flag2 = "bi-bookmark-fill";
                value2 = "1";
            }
            card.appendChild(carousel);
            card.innerHTML += `<div class="info">
                               <div class="info_left">
                                    <i value="${value}" style="color:#ff69b4"onclick="like(event)" url="${ele.id}" class="bi ${flag}"></i>
                                    <i class="far fa-comment" data-bs-toggle="modal" data-bs-target="#commentModal" value="${ele.id}"  onclick="commentlist(event)"></i>
                                </div>
                                <div class="info_right">
                                  <i id="bookmark" url="${ele.id}" value="${value2}" class="bi ${flag2}" onclick="bookmark(event)"></i>
                                </div>
                            </div>`;
            //좋아요 목록
            card.innerHTML += `<div class="ll" id="like${ele.id}">${ele.likeCount} 
                  <a href="#" data-bs-toggle="modal" data-bs-target="#likeModal" value="${ele.id}"  onclick="likeList(event)">
                    명이 좋아합니다.</a><div>`;

            card.innerHTML += ` <div class="comment">
                                ${ele.content}
                            </div>`;
            card.innerHTML += `<div class="comment_form">
                                <div class="comments" url="${ele.id}">
                                    <div style="margin-left:10px">댓글</div>
  
                                </div>  
                                <div id="RegisterForm">
                                    <input id="re" type="text" placeholder="댓글 입력..">
                                    <button type="button" id="commentRegister" url="${ele.id}">등록</button>
                                </div>
                            </div>`;
            main.appendChild(card);
            let arr = document.querySelectorAll(`div .comments`);
            for (const element of arr) {
                const postId = element.getAttribute("url");
                const data = await axios.get(
                    `/comment/comments?PostId=${postId}`
                );

                data.data.forEach(async (ele) => {
                    let tag = `<div class="come">
                              <a href="/profile?id=${ele["User.id"]}">
                                <img src="${ele["User.profile"]}"> ${ele["User.nickName"]}
                              </a> : ${ele.comment} <span class=commentTime>${ele.time}</span>
                            </div>`;
                    if (ele.me == "true") {
                        console.log(ele.id);
                        tag += `<i class="fa-solid fa-trash" id ="delete" onclick="deleteComent(event)" url="${postId}"value="${ele.id}"></i></i>`;
                    }
                    const temp = `<div class="commentPlace" id="c${postId}"> ${tag} </div>`;
                    element.innerHTML += temp;
                });
            }
            arr = document.querySelectorAll(
                `#commentRegister`
            );
            for (const ele of arr) {
                ele.addEventListener("click", async (event) => {
                    const postId = ele.getAttribute("url");
                    const input =
                        event.target.parentNode.querySelector("input").value;
                    event.target.parentNode.querySelector("input").value = "";
                    if (input.length == 0) {
                        alert("댓글을 입력해 주세요");
                    } else {
                        const data = await axios.post("/comment/comments", {
                            comment: input,
                            postId: postId,
                        });

                        if (data.data.code == 200) {
                            const res = await axios.get(
                                `/comment/comments?PostId=${postId}`
                            );
                            document.querySelectorAll(`#c${postId}`).forEach((c) => {
                                c.remove();
                            });
                            const space = document.querySelector(
                                `div[url="${postId}"].comments`
                            );
                            res.data.forEach((res) => {
                                let tag = `<a href="/profile?id=${res["User.id"]}"> <div class="come">
                                            <img src="${res["User.profile"]}"> ${res["User.nickName"]}</a>:${res.comment}
                                            </div>`;

                                if (res.me) {
                                    tag += `<button type="button" id ="delete" onclick="deleteComent(event)" url="${postId}"value="${res.id}">삭제</button>`;
                                }
                                const div = `<div class="commentPlace"  id="c${postId}"> ${tag} </div>`;
                                space.innerHTML += div;
                                console.log(space);
                            });
                        }
                    }
                });
            }
            cnt += 1;
        }
        $("#boardModal").modal("show");
    });
}

async function deleteComent(event) {
    const comentD = await axios.post("comment/commentDelete", {
        id: event.target.getAttribute("value"),
    });
    if (comentD.data.code == 200) {
        const postId = event.target.getAttribute("url");
        const commentId = event.target.getAttribute("value");
        const res = await axios.get(`/comment/comments?PostId=${postId}`);
        document.querySelectorAll(`#c${postId}`).forEach((c) => {
            c.remove();
        });
        const space = document.querySelector(`div[url="${postId}"].comments`);
        res.data.forEach((res) => {
            let tag = `<a href="/profile?id=${res["User.id"]}"> <div class="come">
                  <img src="${res["User.profile"]}"> ${res["User.nickName"]}</a>:${res.comment}
                  </div>`;
            if (res.me) {
                tag += `<button type="button" id ="delete" onclick="deleteComent(event)" url="${postId}"value="${res.id}">삭제</button>`;
            }
            const div = `<div class="commentPlace" id="c${postId}"> ${tag} </div>`;
            space.innerHTML += div;
            console.log(space);
        });
        swal("", "댓글 삭제 성공", "success");
    }
}
async function like(event) {
    if (event.target.getAttribute("value") == "1") {
        event.target.setAttribute("value", "0");
        event.target.classList.remove("bi-heart-fill");
        event.target.classList.add("bi-heart");
    } else {
        event.target.classList.add("bi-heart-fill");
        event.target.classList.remove("bi-heart");
        event.target.setAttribute("value", "1");
    }
    const postId = event.target.getAttribute("url");
    const res = await axios.post("like/likes", {
        postId: postId,
    });
    if (res.data.code == 200) {
        swal("", "좋아요 등록 완료!", "success");
    } else {
        swal("", "좋아요 취소", "success");
    }
    const send = await axios.get(`like/likeCount?PostId=${postId}`);
    document.querySelector(
        `#like${postId}`
    ).innerHTML = `<a href="#" data-bs-toggle="modal" data-bs-target="#likeModal" value="${postId}"  onclick="likeList(event)">${send.data.Count}명이 좋아합니다.</a>`;
    console.log(send);
}

function likeList(event) {
    const postid = event.target.getAttribute("value");

    const data = {
        PostId: postid,
    };
    axios({
        url: "/like/list",
        method: "get",
        params: data,
    }).then((response) => {
        let modalBody = document.querySelector("#llist");
        modalBody.innerHTML = "";
        let html = "";
        let ListMode = response.data.data;
        for (let i = 0; i < ListMode.length; i++) {
            html += `<div style="cursor: pointer">
                        <div class="likeUser" onclick="location.href='profile?id=${ListMode[i].id}';">
                          <img class="likeProfile" src="${ListMode[i].profile}" alt="">
                          <span class="userName">${ListMode[i].nickName}</span>
                          <span class="userEmail">${ListMode[i].email}</span>
                        </div>
                      </div>`;
        }
        modalBody.innerHTML = html;
    });
}

function commentlist(event) {
    const postid = event.target.getAttribute("value");
    const data = {
        PostId: postid
    };
    axios({
        url: "/comment/commentList",
        method: "get",
        params: data,
    }).then((response) => {
        console.log(response.data);
        let modalBody = document.querySelector("#clist");
        modalBody.innerHTML = "";
        let html = "";
        let ListMode = response.data;
        for (let i = 0; i < ListMode.length; i++) {
            if (ListMode[i].me) {
                html += `<div style="cursor: pointer">
                        <div class="commentUser" onclick="location.href='profile?id=${ListMode[i]["User.id"]}';">
                          <img class="commentProfile" src="${ListMode[i]["User.profile"]}" alt="">
                          <span class="commentuserName">${ListMode[i]["User.nickName"]}</span>
                          <span class="commentuserComment">${ListMode[i]["comment"]}</span>
                        </div>
                        <i id ="deleteComment" onclick="listDelete(event)" url="${postid}"value="${ListMode[i].id}" class="fa-solid fa-trash"></i>
                      </div>`;
            } else {
                html += `<div style="cursor: pointer">
                        <div class="commentUser" onclick="location.href='profile?id=${ListMode[i]["User.id"]}';">
                          <img class="commentProfile" src="${ListMode[i]["User.profile"]}" alt="">
                          <span class="commentuserName">${ListMode[i]["User.nickName"]}</span>
                          <span class="commentuserComment">${ListMode[i]["comment"]}</span>
                        </div>
                      </div>`;
            }
        }
        modalBody.innerHTML = html;
    });
}

async function listDelete(event) {
    const comentD = await axios.post("comment/commentDelete", {
        id: event.target.getAttribute("value"),
    });

    if (comentD.data.code == 200) {
        event.target.parentNode.parentNode.innerHTML = "";
        console.log(event.target.parentNode.parentNode);
        const postid = event.target.getAttribute("url");
        const data = {
            PostId: postid
        };
        axios({
            url: "/comment/commentList",
            method: "get",
            params: data,
        }).then((response) => {
            console.log(response.data);
            let modalBody = document.querySelector("#clist");
            modalBody.innerHTML = "";
            let html = "";
            let ListMode = response.data;
            for (let i = 0; i < ListMode.length; i++) {
                if (ListMode[i].me) {
                    html += `<div style="cursor: pointer">
                        <div class="commentUser" onclick="location.href='profile?id=${ListMode[i]["User.id"]}';">
                          <img class="commentProfile" src="${ListMode[i]["User.profile"]}" alt="">
                          <span class="commentuserName">${ListMode[i]["User.nickName"]}</span>
                          <span class="commentuserComment">${ListMode[i]["comment"]}</span>
                        </div>
                        <i id ="deleteComment" onclick="listDelete(event)" url="${postid}"value="${ListMode[i].id}" class="fa-solid fa-trash"></i>
                      </div>`;
                } else {
                    html += `<div style="cursor: pointer">
                        <div class="commentUser" onclick="location.href='profile?id=${ListMode[i]["User.id"]}';">
                          <img class="commentProfile" src="${ListMode[i]["User.profile"]}" alt="">
                          <span class="commentuserName">${ListMode[i]["User.nickName"]}</span>
                          <span class="commentuserComment">${ListMode[i]["comment"]}</span>
                        </div>
                      </div>`;
                }
            }

            modalBody.innerHTML = html;
        });
        const target = document.querySelector(`#delete[url="${postid}"]`);
        const wrap = {
            target: target
        };
        deleteComent(wrap);
    }
}

async function bookmark(event) {
    if (event.target.getAttribute("value") == "0") {
        event.target.setAttribute("value", "1");
        event.target.setAttribute("class", "bi bi-bookmark-fill");
    } else {
        event.target.setAttribute("value", "0");
        event.target.setAttribute("class", "bi bi-bookmark");
    }
    const res = await axios.post("/profile/bookmark", {
        postId: event.target.getAttribute("url"),
    });
    if (res.data.code == 200) {
        swal("", "북마크 등록 완료!", "success");
    } else {
        swal("", "북마크 취소 완료!", "success");
    }
}