"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Save, ImageIcon, FileText, Layout } from "lucide-react"

// Mock data for blog posts
const mockBlogPosts = [
  {
    id: 1,
    title: "10 Tips for Improving Soil Health",
    slug: "10-tips-for-improving-soil-health",
    category: "Soil Health",
    status: "published",
    publishDate: "2023-05-15",
    excerpt: "Learn the top 10 ways to improve your soil health for better crop yields.",
  },
  {
    id: 2,
    title: "Understanding Regenerative Agriculture",
    slug: "understanding-regenerative-agriculture",
    category: "Regenerative Farming",
    status: "published",
    publishDate: "2023-06-22",
    excerpt: "A comprehensive guide to regenerative agriculture practices.",
  },
  {
    id: 3,
    title: "Seasonal Planting Guide",
    slug: "seasonal-planting-guide",
    category: "Farming Tips",
    status: "draft",
    publishDate: "",
    excerpt: "When to plant what: A seasonal guide for Indian farmers.",
  },
]

// Mock data for pages
const mockPages = [
  {
    id: 1,
    title: "About Us",
    slug: "about",
    status: "published",
    lastUpdated: "2023-04-10",
  },
  {
    id: 2,
    title: "Contact",
    slug: "contact",
    status: "published",
    lastUpdated: "2023-04-12",
  },
  {
    id: 3,
    title: "FAQ",
    slug: "faq",
    status: "published",
    lastUpdated: "2023-05-20",
  },
  {
    id: 4,
    title: "Terms of Service",
    slug: "terms-of-service",
    status: "draft",
    lastUpdated: "2023-06-15",
  },
]

export function ContentManager() {
  const [blogPosts, setBlogPosts] = useState(mockBlogPosts)
  const [pages, setPages] = useState(mockPages)
  const [isEditingPost, setIsEditingPost] = useState(false)
  const [isEditingPage, setIsEditingPage] = useState(false)
  const [currentPost, setCurrentPost] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState<any>(null)

  // Function to handle editing a blog post
  const handleEditPost = (post: any) => {
    setCurrentPost(post)
    setIsEditingPost(true)
  }

  // Function to handle editing a page
  const handleEditPage = (page: any) => {
    setCurrentPage(page)
    setIsEditingPage(true)
  }

  // Function to handle creating a new blog post
  const handleNewPost = () => {
    setCurrentPost({
      id: Date.now(),
      title: "",
      slug: "",
      category: "",
      status: "draft",
      publishDate: "",
      excerpt: "",
      content: "",
    })
    setIsEditingPost(true)
  }

  // Function to handle creating a new page
  const handleNewPage = () => {
    setCurrentPage({
      id: Date.now(),
      title: "",
      slug: "",
      status: "draft",
      lastUpdated: new Date().toISOString().split("T")[0],
      content: "",
    })
    setIsEditingPage(true)
  }

  // Function to save a blog post
  const savePost = () => {
    if (currentPost) {
      const postIndex = blogPosts.findIndex((post) => post.id === currentPost.id)
      if (postIndex >= 0) {
        // Update existing post
        const updatedPosts = [...blogPosts]
        updatedPosts[postIndex] = currentPost
        setBlogPosts(updatedPosts)
      } else {
        // Add new post
        setBlogPosts([...blogPosts, currentPost])
      }
      setIsEditingPost(false)
      setCurrentPost(null)
    }
  }

  // Function to save a page
  const savePage = () => {
    if (currentPage) {
      const pageIndex = pages.findIndex((page) => page.id === currentPage.id)
      if (pageIndex >= 0) {
        // Update existing page
        const updatedPages = [...pages]
        updatedPages[pageIndex] = currentPage
        setPages(updatedPages)
      } else {
        // Add new page
        setPages([...pages, currentPage])
      }
      setIsEditingPage(false)
      setCurrentPage(null)
    }
  }

  // Function to delete a blog post
  const deletePost = (id: number) => {
    setBlogPosts(blogPosts.filter((post) => post.id !== id))
  }

  // Function to delete a page
  const deletePage = (id: number) => {
    setPages(pages.filter((page) => page.id !== id))
  }

  return (
    <Tabs defaultValue="blog" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="blog" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Blog Posts
        </TabsTrigger>
        <TabsTrigger value="pages" className="flex items-center gap-2">
          <Layout className="h-4 w-4" />
          Pages
        </TabsTrigger>
      </TabsList>

      {/* Blog Posts Tab */}
      <TabsContent value="blog" className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Blog Posts</h2>
          <Button onClick={handleNewPost} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Publish Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          post.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.status}
                      </span>
                    </TableCell>
                    <TableCell>{post.publishDate || "Not published"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditPost(post)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deletePost(post.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Blog Post Editor Dialog */}
        <Dialog open={isEditingPost} onOpenChange={(open) => !open && setIsEditingPost(false)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{currentPost?.id ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
              <DialogDescription>Make changes to your blog post here. Click save when you're done.</DialogDescription>
            </DialogHeader>
            {currentPost && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={currentPost.title}
                      onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                      placeholder="Post title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={currentPost.slug}
                      onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                      placeholder="post-slug"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={currentPost.category}
                      onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                      placeholder="Post category"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={currentPost.status}
                      onValueChange={(value) => setCurrentPost({ ...currentPost, status: value })}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={currentPost.excerpt}
                    onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                    placeholder="Brief excerpt of the post"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={currentPost.content || ""}
                    onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                    placeholder="Post content"
                    rows={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="featured-image">Featured Image</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-32 w-32 border-2 border-dashed rounded-md flex items-center justify-center bg-muted">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <Button variant="outline">Upload Image</Button>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditingPost(false)}>
                Cancel
              </Button>
              <Button onClick={savePost} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
                <Save className="h-4 w-4 mr-2" />
                Save Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TabsContent>

      {/* Pages Tab */}
      <TabsContent value="pages" className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Pages</h2>
          <Button onClick={handleNewPage} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
            <Plus className="h-4 w-4 mr-2" />
            New Page
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell>{page.slug}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          page.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {page.status}
                      </span>
                    </TableCell>
                    <TableCell>{page.lastUpdated}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditPage(page)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deletePage(page.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Page Editor Dialog */}
        <Dialog open={isEditingPage} onOpenChange={(open) => !open && setIsEditingPage(false)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{currentPage?.id ? "Edit Page" : "Create New Page"}</DialogTitle>
              <DialogDescription>Make changes to your page here. Click save when you're done.</DialogDescription>
            </DialogHeader>
            {currentPage && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="page-title">Title</Label>
                    <Input
                      id="page-title"
                      value={currentPage.title}
                      onChange={(e) => setCurrentPage({ ...currentPage, title: e.target.value })}
                      placeholder="Page title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="page-slug">Slug</Label>
                    <Input
                      id="page-slug"
                      value={currentPage.slug}
                      onChange={(e) => setCurrentPage({ ...currentPage, slug: e.target.value })}
                      placeholder="page-slug"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="page-status">Status</Label>
                  <Select
                    value={currentPage.status}
                    onValueChange={(value) => setCurrentPage({ ...currentPage, status: value })}
                  >
                    <SelectTrigger id="page-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="page-content">Content</Label>
                  <Textarea
                    id="page-content"
                    value={currentPage.content || ""}
                    onChange={(e) => setCurrentPage({ ...currentPage, content: e.target.value })}
                    placeholder="Page content"
                    rows={15}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditingPage(false)}>
                Cancel
              </Button>
              <Button onClick={savePage} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
                <Save className="h-4 w-4 mr-2" />
                Save Page
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TabsContent>
    </Tabs>
  )
}
